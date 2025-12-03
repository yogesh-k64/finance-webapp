import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { HeadCell } from "./interface";
import { HandoutRespClass } from "../responseClass/HandoutResp";
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
          <span>{item.getHandout().getAmount()}</span>
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
          <span>{item.getAmount()}</span>
        </div>
        <div className="mobile-detail-row">
          <span>{item.getDateStr()}</span>
          <span>Handout: {item.getHandoutId()}</span>
        </div>
      </div>
    ),
  },
];
