/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { env } from "~/config/environment";

//nhung domain dc phep truy cap toi server
export const WHITELIST_DOMAINS = [
  // "http://localhost:5173",
  "https://fe-deploy-tau.vercel.app",
];
export const board_types = {
  public: "public",
  private: "private",
};
export const WEBSITE_DOMAIN =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEM_PER_PAGE = 12;

export const INVITATION_TYPES = {
  BOARD_INVITATION: "BOARD_INVITATION",
};
export const BOARD_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const CARD_MEMBER_ACTION = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};
