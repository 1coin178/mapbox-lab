import {
  AppBar,
  Container,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import React, { useRef, useState } from "react";
import MapView, {
  DEFAULT_MAP_VIEWPORT,
  MapViewPort,
} from "../../component/Map/MapView";

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
  const mapContainerRef = useRef(null);
  // useEffect(() => {
  //   const map = MapContainer.getInstance().init(mapContainerRef.current);
  //   return () => map.remove();
  // }, []);

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
                  Basic
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
        <MapView
          viewport={viewport}
          onViewportChange={onViewportChange}
        ></MapView>
      </Container>
    </>
  );
};

export default Basic;
