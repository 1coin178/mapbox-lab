import polyline from "@mapbox/polyline";
import {
  AppBar,
  Container,
  Grid,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { isEmpty } from "lodash";
import mapboxgl from "mapbox-gl";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Layer, Source, WebMercatorViewport } from "react-map-gl";
import turf from "turf";
import MapView, {
  DEFAULT_MAP_VIEWPORT,
  MapViewPort
} from "../../component/Map/MapView";
import { parseCoordinatesByMultiLine } from "../../service/points/parser";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

interface Props {
  query: { pl?: string; points?: string };
}

const SymbolLayer: NextPage<Props, any> = (props) => {
  console.log(props);
  const classes = useStyles();
  const [viewport, setViewPort] = useState<MapViewPort>(DEFAULT_MAP_VIEWPORT);
  const [encodedPolyline, setEncodedPolyline] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [geojsonRouteLayer, setGeojsonRouteLayer] = useState<
    GeoJSON.Feature<GeoJSON.LineString | null>
  >(null);
  const [geojsonPoint, setGeojsonPoint] = useState<GeoJSON.FeatureCollection<
    GeoJSON.Point
  > | null>(null);

  const onViewportChange = (viewport: MapViewPort): MapViewPort => {
    setViewPort(viewport);
    return viewport;
  };

  const onMapUpdate = () => {
    // polyline
    const polylineCoordinates =
      encodedPolyline !== ""
        ? polyline.decode(encodedPolyline, 6).map((p) => [p[1], p[0]])
        : null;
    const geojsonRouteLayer = polylineCoordinates
      ? ({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: polylineCoordinates,
          },
        } as GeoJSON.Feature<GeoJSON.LineString>)
      : null;
    setGeojsonRouteLayer(geojsonRouteLayer);

    // points
    const coordinates = parseCoordinatesByMultiLine(points).map((c) => {
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [c.lng, c.lat] },
      };
    });
    const geojsonPoint =
      coordinates.length > 0
        ? ({
            type: "FeatureCollection",
            features: coordinates,
          } as GeoJSON.FeatureCollection<GeoJSON.Point>)
        : null;
    setGeojsonPoint(geojsonPoint);
  };

  /**
   * 地図更新
   */
  useEffect(() => {
    onMapUpdate();
  }, [encodedPolyline, points]);

  useEffect(() => {
    setEncodedPolyline(props.query.pl ?? "");
    setPoints(props.query.points ?? "");
  }, [props]);

  /**
   * 地図移動
   */
  useEffect(() => {
    if (!geojsonRouteLayer && !geojsonPoint) {
      return;
    }

    const coordinates = [
      ...(geojsonRouteLayer?.geometry.coordinates ?? []).concat(
        geojsonPoint?.features.map((f) => {
          const c = f.geometry.coordinates;
          return [c[0], c[1]];
        }) ?? []
      ),
    ];
    console.log(coordinates);
    const line = turf.lineString(coordinates);
    const bbox = turf.bbox(line);
    const bounds = mapboxgl.LngLatBounds.convert(bbox as any);

    const { longitude, latitude, zoom } = new WebMercatorViewport({
      width: 400,
      height: 400,
    }).fitBounds(bounds.toArray() as any, {
      padding: 20,
      offset: [0, -100],
    });

    setViewPort({
      ...viewport,
      zoom: zoom,
      longitude: longitude,
      latitude: latitude,
    });
  }, [geojsonRouteLayer, geojsonPoint]);

  /**
   * URL更新
   */
  useEffect(() => {
    const params = new URLSearchParams();
    if (!isEmpty(encodedPolyline)) {
      params.set("pl", encodedPolyline);
    }
    if (!isEmpty(points)) {
      params.set("points", points);
    }
    Router.push({
      query: params.toString(),
    });
  }, [encodedPolyline, points]);

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
                  Route Layer
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
        <label className="text-gray-600 font-light">
          encodedPolyline(precision:6)
        </label>
        <input
          id="polyline"
          type="text"
          value={encodedPolyline}
          placeholder="Enter your encoded polyline"
          onChange={(e) => setEncodedPolyline(e.target.value)}
          className="w-full mt-2 mb-6 px-6 py-3 border rounded-lg text-lg text-gray-700 focus:outline-none"
        />
        <label className="text-gray-600 font-light">coordinates</label>
        <textarea
          id="points"
          value={points}
          placeholder={"lat1,lon1\nlat2,lon2"}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full mt-2 mb-6 px-6 py-3 border rounded-lg text-lg text-gray-700 focus:outline-none"
        />
        <button
          id="update"
          onClick={onMapUpdate}
          type="button"
          className="mb-1 w-full bg-blue-600 text-gray-200 rounded hover:bg-blue-500 px-4 py-2 focus:outline-none"
        >
          update
        </button>
        {/* 地図 */}
        <MapView viewport={viewport} onViewportChange={onViewportChange}>
          {geojsonRouteLayer && (
            <Source id="route" type="geojson" data={geojsonRouteLayer}>
              <Layer
                id="line"
                type="line"
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
                paint={{
                  "line-color": "#0000ff",
                  "line-width": 8,
                }}
              />
            </Source>
          )}
          {geojsonPoint && (
            <Source id="points" type="geojson" data={geojsonPoint}>
              <Layer
                id="point"
                type="circle"
                paint={{
                  "circle-radius": 10,
                  "circle-color": "#ff0000",
                }}
              />
            </Source>
          )}
        </MapView>
      </Container>
    </>
  );
};

SymbolLayer.getInitialProps = ({ query }) => {
  return { query };
};

export default SymbolLayer;
