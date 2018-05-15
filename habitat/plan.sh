pkg_name=api
pkg_origin=chefconf
pkg_scaffolding="core/scaffolding-node"

pkg_binds=(
  [site]="port"
)
pkg_exports=(
  [port]=port
)
pkg_exposes=(port)

pkg_version() {
  node -p "require('$SRC_PATH/package.json').version"
}

do_before() {
  do_default_before
  update_pkg_version
}

do_build() {
  npm install
  ln -sf $(hab pkg path core/coreutils)/bin/* /usr/bin
  npm run prestart
  rm package-lock.json
}

do_install() {
  cp -rf ./* $PREFIX/.
}