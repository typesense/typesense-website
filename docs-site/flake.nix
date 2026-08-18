{
  description = "Typesense documentation site (VitePress) development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            yarn
            # `serve` script uses http-server; git for edit-link tooling
            git
          ];

          shellHook = ''
            echo "Typesense docs dev shell — Node $(node --version), Yarn $(yarn --version)"
            echo "  yarn install    install dependencies"
            echo "  yarn dev        start the VitePress dev server"
            echo "  yarn build      production build"
          '';
        };
      });
}
