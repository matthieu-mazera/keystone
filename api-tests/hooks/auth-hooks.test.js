const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Password } = require('@keystonejs/fields');
const { multiAdapterRunners, setupServer } = require('@keystonejs/test-utils');

function setupKeystone(adapterName) {
  return setupServer({
    adapterName,
    createLists: keystone => {
      keystone.createList('User', {
        fields: {
          name: { type: Text },
          email: { type: Text },
          password: { type: Password },
        },
      });

      keystone.createAuthStrategy({
        type: PasswordAuthStrategy,
        list: 'User',
        hooks: {
          resolveAuthInput: () => {},
          validateAuthInput: () => {},
          beforeAuth: () => {},
          afterAuth: () => {},
          beforeUnauth: () => {},
          afterUnauth: () => {},
        },
      });
    },
  });
}

multiAdapterRunners().map(({ runner, adapterName }) =>
  describe(`Adapter: ${adapterName}`, () => {
    describe('List Hooks: #resolveInput()', () => {
      it(
        'resolves fields first, then passes them to the list',
        runner(setupKeystone, async ({ keystone }) => {
          await keystone.executeGraphQL({
            query: `
              mutation {
                createUser(data: { name: "jess" }) { name }
              }
            `,
          });
        })
      );
    });
  })
);
