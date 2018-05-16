import express from 'express';
import bodyParser from 'body-parser';
import rp from 'request-promise-native';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import DataLoader from 'dataloader';
import pkg from '../package.json';

class SiteConnector {
  constructor() {
    this.rp = rp;
    this.loader = new DataLoader(this.loadKeys.bind(this), { batch: false })
  }

  request(method, path, body) {
    return this.rp({
      method,
      body,
      uri: path,
      json: true,
      resolveWithFullResponse: true,
    }).then(res => res.body);
  }

  loadKeys(keys) {
    return Promise.all(keys.map((path) => this.request('GET', path)))
  }

  get(path) {
    return this.loader.load(path);
  }

  post(path, body) {
    return this.request('POST', path, body);
  }
}

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    info: Info
    site(id: ID!): Site
    sites: [Site]
  }
  type Info {
    pid: String
    name: String
    version: String
  }
  type Site {
    id: ID
    uri: String
    name: String
    orders: [Order]
  }
  type Order {
    id: ID
    name: String
  }
  type Mutation {
    createOrder(createOrderInput: CreateOrderInput!): Order
  }
  input OrderInput {
    name: String
  }
  input CreateOrderInput {
    siteId: ID!
    order: OrderInput!
  }
`;

export const createGraphQLRouter = ({ config }) => {
  const router = express.Router();

  const resolvers = {
    Query: {
      info: () => ({
        pid: process.pid,
        name: pkg.name,
        version: pkg.version,
      }),
      sites: () => config.sites,
      site: (root, { id }) => config.sites.find(s => s.id === id),
    },
    Mutation: {
      createOrder: async (root, { createOrderInput: { siteId, order } }, context) => {
        const site = config.sites.find(s => s.id === siteId);
        if (site) {
          return context.site.post(`${site.uri}/api/orders`, order)
        } else {
          const knownAPIs = config.apis.map(a => context.site.get(`${a.uri}/api/sites`));
          const knownSites = await Promise.all(knownAPIs).then((allRes) => {
            return allRes.reduce((sites, res) => sites.concat(res), []);
          });
          const foundSite = knownSites.find(s => s.id === siteId);
          if (foundSite) {
            return context.site.post(`${foundSite.uri}/api/orders`, order)
          }
        }
        throw new Error(`No site with id "${siteId}" found.`);
      },
    },
    Site: {
      orders: (site, _, context) => {
        return context.site.get(`${site.uri}/api/orders`)
      }
    }
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  router.use('/graphql', bodyParser.json(), graphqlExpress(() => ({
    schema,
    context: {
      site: new SiteConnector(),
    }
  })));
  router.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

 return router;
}