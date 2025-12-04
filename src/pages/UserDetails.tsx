import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Box, Divider } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useUserList } from "../store/customerSlice";
import { useIsMobile } from "../store/AppConfigReducer";
import useUserApi from "../hooks/useUserApi";
import TableComponentV1 from "../common/TableComponent";
import type { HeadCell } from "../utils/interface";
import { UserClass } from "../responseClass/UserClass";
import { userDetailsHandoutMobileHeadCell } from "../utils/mobileTableCells";

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userList = useSelector(useUserList);
  const isMobile = useSelector(useIsMobile);
  const { getUserHandouts, getUserReferredBy, userHandouts, userReferredBy, loading } = useUserApi();
  const [selectedUser, setSelectedUser] = useState<UserClass | null>(null);

  const handoutHeadCell: HeadCell[] = [
    { label: "id", renderValue: "getId" },
    { label: "amount", renderValue: "getDispAmount" },
    { label: "date", renderValue: "getDateStr" },
    { label: "createdAt", renderValue: "getCreatedAt" },
    { label: "updatedAt", renderValue: "getUpdatedAt" },
  ];

  useEffect(() => {
    if (id) {
      const userId = Number(id);
      const user = userList.find((u) => u.getId() === userId);
      if (user) {
        setSelectedUser(user);
        getUserHandouts(userId);
        getUserReferredBy(userId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userList]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!selectedUser) {
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
          <span className="title label-title">User Details</span>
        </div>

        <Box sx={{ marginBottom: 3 }}>
          <Card className="details-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedUser.getName()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedUser.getId()}
                </Typography>
                <Typography variant="body1">
                  <strong>Mobile:</strong> {selectedUser.getMobile()}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {selectedUser.getAddress() || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Info:</strong> {selectedUser.getInfo() || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Created At:</strong> {selectedUser.getCreatedAt()}
                </Typography>
                <Typography variant="body1">
                  <strong>Updated At:</strong> {selectedUser.getUpdatedAt()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {userReferredBy && (
          <Box sx={{ marginBottom: 3 }}>
            <Card className="details-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Referred By
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {userReferredBy.getName()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>ID:</strong> {userReferredBy.getId()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mobile:</strong> {userReferredBy.getMobile()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {userReferredBy.getAddress() || "-"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        <Box>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 3, marginBottom: 2 }}>
            User Handouts
          </Typography>
          <TableComponentV1
            headCell={isMobile ? userDetailsHandoutMobileHeadCell : handoutHeadCell}
            list={userHandouts}
            loading={loading}
          />
        </Box>
      </div>
    </div>
  );
}

export default UserDetails;
