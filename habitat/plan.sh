pkg_name=api
pkg_origin=chefconf
pkg_version="0.1.0"
pkg_scaffolding="core/scaffolding-node"

do_build() {
  npm install
  npm run prestart
  rm package-lock.json
}

do_install() {
  cp -rf ./* $PREFIX/.
}