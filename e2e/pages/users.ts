import type { Page, Locator } from "@playwright/test";

export class UsersPage {
  private readonly activeUsers: Locator;
  private readonly invitedUsers: Locator;

  constructor(public readonly page: Page) {
    this.activeUsers = page.locator('[data-testid="active-user"]');
    this.invitedUsers = page.locator('[data-testid="invited-user"]');
  }

  getInvitedUser(email: string) {
    return this.invitedUsers.filter({ hasText: email });
  }

  getActiveUser(email: string) {
    return this.activeUsers.filter({ hasText: email });
  }

  async inviteUser(email: string) {
    await this.page.getByRole("button", { name: "Invite user" }).click();
    await this.page.getByLabel("Email*").click();
    await this.page.getByLabel("Email*").fill(email);
    await this.page.getByRole("button", { name: "Send invitation" }).click();
  }

  async revokeUser(email: string) {
    const revokeButton = this.getInvitedUser(email).getByRole("button", {
      name: "Revoke",
    });
    await revokeButton.click();
  }

  async goto() {
    await this.page.goto("/users");
  }
}
