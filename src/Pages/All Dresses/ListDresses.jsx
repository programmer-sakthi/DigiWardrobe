import React, { useEffect, useState } from "react";
import { fetchDresses } from "../../services/dressFetch";
import { Card } from "./Card";
import classes from "./ListDresses.module.css";

const ListDresses = (props) => {
  const [dressList, setDressList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFireBase = async () => {
    setLoading(true);
    try {
      const dresses = await fetchDresses(props.id);
      setDressList(dresses);
    } catch (error) {
      console.error("Error fetching dresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFireBase();
  }, [props.id]);

  return (
    <div className={classes.container}>
      {loading ? (
        <div className={classes.loaderDiv}>
          <span className={classes.loader}></span>
        </div>
      ) : (
        dressList.map((ele, index) => (
          <Card
            key={index}
            className={classes.fadeIn}
            dressList={ele}
            fetchFireBase={fetchFireBase}
          />
        ))
      )}
    </div>
  );
};

export default ListDresses;
