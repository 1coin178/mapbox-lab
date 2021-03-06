import {
  AppBar,
  Container,
  Grid,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import React, { useState } from "react";
import { Marker } from "react-map-gl";
import MapView, {
  DEFAULT_MAP_VIEWPORT,
  MapViewPort
} from "../../component/Map/MapView";
import { MapConst } from "../../styles/service/map/const";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Basic = () => {
  const classes = useStyles();

  const [viewport, setViewPort] = useState<MapViewPort>(DEFAULT_MAP_VIEWPORT);

  const onViewportChange = (viewport: MapViewPort): MapViewPort => {
    setViewPort(viewport);
    return viewport;
  };

  return (
    <>
      <Container maxWidth={false}>
        {/* App Header */}
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Grid
              container
              className={classes.root}
              spacing={2}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h6" className={classes.title}>
                  マーカー表示
                </Typography>
              </Grid>
              <Grid item>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link href="/">Home</Link>
                </Breadcrumbs>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {/* 地図 */}
        <MapView viewport={viewport} onViewportChange={onViewportChange}>
          <Marker
            latitude={MapConst.POINT_TOKYO_STATION.lat}
            longitude={MapConst.POINT_TOKYO_STATION.lng}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <img src="https://icons.iconarchive.com/icons/icons8/windows-8/96/Cinema-Batman-Old-icon.png" />
          </Marker>
        </MapView>
      </Container>
    </>
  );
};

export default Basic;
