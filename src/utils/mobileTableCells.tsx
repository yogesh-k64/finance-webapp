import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { HeadCell } from "./interface";
import { HandoutRespClass } from "../responseClass/HandoutResp";
import { HandoutClass } from "../responseClass/HandoutClass";
import { UserClass } from "../responseClass/UserClass";
import { copyToClipboard } from "./utilsFunction";
import type { CollectionClass } from "../responseClass/CollectionClass";

export const handoutMobileHeadCell: HeadCell[] = [
  {
    label: "Handout Details",
    view: (item: HandoutRespClass) => (
      <div className="mobile-detail-container">
        <div className="mobile-detail-row">
          <span>{item.getUser().getName()}</span>
          <span>{item.getHandout().getDispAmount()}</span>
        </div>
        <div className="mobile-detail-row">
          <span
            className="mobile-contact"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(item.getUser().getMobile());
            }}
          >
            {item.getUser().getMobile()}
            <ContentCopyIcon className="copy-icon copy-icon-small" />
          </span>
          <span>{item.getHandout().getDateStr()}</span>
        </div>
        <div className="mobile-detail-row">
          <span>Status: <span className={`status-badge status-${item.getHandout().getStatus().toLowerCase()}`}>{item.getHandout().getStatus()}</span></span>
          <span>Bond: {item.getHandout().getBond() ? <span className="bond-icon bond-yes">✓</span> : <span className="bond-icon bond-no">✕</span>}</span>
        </div>
        <div className="mobile-detail-meta">
          <span>User ID: {item.getUser().getId()}</span>
          <span>Handout ID: {item.getHandout().getId()}</span>
        </div>
      </div>
    ),
  },
];

export const customerMobileHeadCell: HeadCell[] = [
  {
    label: "Customer Details",
    view: (item: UserClass) => (
      <div className="mobile-detail-container">
        <div className="mobile-detail-row">
          <span>{item.getName()}</span>
          <span>ID: {item.getId()}</span>
        </div>
        <div className="mobile-detail-row">
          <span
            className="mobile-contact"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(item.getMobile());
            }}
          >
            {item.getMobile()}
            <ContentCopyIcon className="copy-icon copy-icon-small" />
          </span>
        </div>
        {item.getAddress() && (
          <div className="mobile-detail-meta">
            <span>{item.getAddress()}</span>
          </div>
        )}
        {item.getInfo() && (
          <div className="mobile-detail-meta">
            <span>{item.getInfo()}</span>
          </div>
        )}
      </div>
    ),
  },
];

export const collectionMobileHeadCell: HeadCell[] = [
  {
    label: "Collection Details",
    view: (item: CollectionClass) => (
      <div className="mobile-detail-container">
        <div className="mobile-detail-row">
          <span>{item.getDispAmount()}</span>
        </div>
        <div className="mobile-detail-row">
          <span>{item.getDateStr()}</span>
          {item.getHandoutId() ? <span>Handout: {item.getHandoutId()}</span> : <></>}
        </div>
      </div>
    ),
  },
];

export const userDetailsHandoutMobileHeadCell: HeadCell[] = [
  {
    label: "Handout Details",
    view: (item: HandoutClass) => (
      <div className="mobile-detail-container">
        <div className="mobile-detail-row">
          <span>ID: {item.getId()}</span>
          <span>{item.getDispAmount()}</span>
        </div>
        <div className="mobile-detail-row">
          <span>Status: <span className={`status-badge status-${item.getStatus().toLowerCase()}`}>{item.getStatus()}</span></span>
          <span>Bond: {item.getBond() ? <span className="bond-icon bond-yes">✓</span> : <span className="bond-icon bond-no">✕</span>}</span>
        </div>
        <div className="mobile-detail-row">
          <span>{item.getDateStr()}</span>
        </div>
        <div className="mobile-detail-meta">
          <span>Created: {item.getCreatedAt()}</span>
        </div>
      </div>
    ),
  },
];

import { AdminUserClass } from "../responseClass/AdminUserClass";

export const adminUserMobileHeadCell: HeadCell[] = [
  {
    label: "User Details",
    view: (item: AdminUserClass) => (
      <div className="mobile-detail-container admin-user-mobile">
        <div className="mobile-detail-row admin-user-mobile__header">
          <span className="admin-user-mobile__username">{item.getUsername()}</span>
          <span className="admin-user-mobile__id">ID: {item.getId()}</span>
        </div>
        <div className="mobile-detail-row admin-user-mobile__info">
          <span className={`admin-user-mobile__role admin-user-mobile__role--${item.getRole().toLowerCase()}`}>
            {item.getRole()}
          </span>
          <span className={`admin-user-mobile__status ${item.getActive() ? 'admin-user-mobile__status--active' : 'admin-user-mobile__status--disabled'}`}>
            {item.getStatus()}
          </span>
        </div>
      </div>
    ),
  },
];
