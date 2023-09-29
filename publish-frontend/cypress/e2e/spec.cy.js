describe('template spec', () => {
  it('is possible to login', () => {
    cy.visit('/');
    cy.contains('Sign in').click();
  });
});
