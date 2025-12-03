import {
  getCollectionSummary,
  getHandoutSummary,
} from "../utils/utilsFunction";

import { Grid } from "@mui/material";
import { useCollectionList } from "../store/collectionSlice";
import { useHandoutsList } from "../store/handoutsSlice";
import { useHomeDateRange } from "../store/AppConfigReducer";
import { useSelector } from "react-redux";
import type { HandoutRespClass } from "../responseClass/HandoutResp";

const HomePage = () => {
  const allHandouts = useSelector(useHandoutsList);
  const allCollectionList = useSelector(useCollectionList);
  const values = useSelector(useHomeDateRange);

  const [fromDate, endDate] = values;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());
  const handouts = allHandouts.filter((item: HandoutRespClass) => {
    const handoutDate = item.getHandout().getDate()
    return (
      handoutDate >= fromDateObj && handoutDate <= endDateObj
    );
  });
  const collectionList = allCollectionList.filter((item) => {
    return (
      new Date(item.getDate()) >= fromDateObj && new Date(item.getDate()) <= endDateObj
    );
  });
  const handoutsSummary = getHandoutSummary(handouts, fromDateObj, endDateObj);
  const collectionSummary = getCollectionSummary(
    collectionList,
    fromDateObj,
    endDateObj
  );

  const getOverAllSummary = () => {
    return {
      balance: collectionSummary.total - handoutsSummary.givenToCustomer,
    };
  };

  const summaryList = [
    { title: "Total Given", value: handoutsSummary.givenToCustomer },
    { title: "Collection", value: collectionSummary.total },
    { title: "Last week Balance", value: 0 },
    { title: "Balance", value: getOverAllSummary().balance },
  ];

  return (
    <div className="home-container">
      <Grid container className="summary-grid">
        {summaryList.map((item) => {
          return (
            <Grid
              size={12 / summaryList.length}
              key={item.title}
              className="summary-item"
            >
              <div className="item-box">
                <div className="title">{item.title}</div>
                <div className="value">{item.value.toFixed(2)}</div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default HomePage;
