import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TableComponentV1 from "../common/TableComponent";
import { handoutDetailsHeadCell } from "../utils/tableHeadCells";
import { copyToClipboard } from "../utils/utilsFunction";
import { useHandoutsList } from "../store/handoutsSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useIsMobile } from "../store/AppConfigReducer";
import type { HandoutRespClass } from "../responseClass/HandoutResp";
import useHandoutApi from "../hooks/useHandoutApi";
import { ArrowBack } from "@mui/icons-material";
import { collectionMobileHeadCell } from "../utils/mobileTableCells";

const HandoutsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handoutsList = useSelector(useHandoutsList);
  const isMobile = useSelector(useIsMobile);
  const { getHandoutCollections, handoutCollectionList, loading } =
    useHandoutApi();
  const [selectedHandout, setSelectedHandout] =
    useState<HandoutRespClass | null>(null);

  useEffect(() => {
    if (id) {
      const userId = Number(id);
      const user = handoutsList.find((u) => u.getHandout().getId() === userId);
      if (user) {
        setSelectedHandout(user);
        getHandoutCollections(userId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handoutsList]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!selectedHandout) {
    return (
      <div className="handouts-container">
        <Typography variant="h6">User not found</Typography>
        <Button onClick={handleBack} startIcon={<ArrowBack />}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="handouts-container">
      <div className="table-section">
        <div className="table-header">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            className="action-btn"
          >
            Back
          </Button>
          <span className="title label-title">Handouts Details</span>
        </div>

        <Box sx={{ marginBottom: 3 }}>
          <Card className="details-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedHandout.getHandout().getId()}&nbsp;
                <ContentCopyIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(selectedHandout.getHandout().getId());
                  }}
                  className="copy-icon copy-icon-small"
                />
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {selectedHandout.getHandout().getDateStr()}
                </Typography>
                <Typography variant="body1">
                  <strong>Amount:</strong>{" "}
                  {selectedHandout.getHandout().getDispAmount()}
                </Typography>
                <Typography variant="body1">
                  <strong>Created At:</strong>{" "}
                  {selectedHandout.getHandout().getCreatedAt()}
                </Typography>
                <Typography variant="body1">
                  <strong>Updated At:</strong>{" "}
                  {selectedHandout.getHandout().getUpdatedAt()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Card className="details-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedHandout.getUser().getName()}
                </Typography>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedHandout.getUser().getId()}
                </Typography>
                <Typography variant="body1">
                  <strong>Mobile:</strong>{" "}
                  {selectedHandout.getUser().getMobile()}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong>{" "}
                  {selectedHandout.getUser().getAddress()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginTop: 3, marginBottom: 2 }}
          >
            Handout's collections
          </Typography>
          <TableComponentV1
            headCell={
              isMobile ? collectionMobileHeadCell : handoutDetailsHeadCell
            }
            list={handoutCollectionList}
            loading={loading}
          />
        </Box>
      </div>
    </div>
  );
};

export default HandoutsDetails;
