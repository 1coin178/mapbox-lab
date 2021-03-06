import { Card, CardActions, CardContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head";
import Link from "next/link";
import GithubRibbon from "../component/link/GithubRibbon";
import styles from "../styles/Home.module.css";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <GithubRibbon></GithubRibbon>
        <h1 className={styles.title}>Welcome to Mapbox-Lab</h1>

        <div className={styles.grid}>
          <Card className={classes.root}>
            <CardContent>
              <h2>地図表示</h2>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href="/basic">詳しく見る</Link>
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.root}>
            <CardContent>
              <h2>マーカー表示</h2>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href="/marker">詳しく見る</Link>
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.root}>
            <CardContent>
              <h2>Symbol Layer</h2>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href="/layer-symbol">詳しく見る</Link>
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.root}>
            <CardContent>
              <h2>Route Layer</h2>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href="/layer-route">詳しく見る</Link>
              </Button>
            </CardActions>
          </Card>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a> */}
      </footer>
    </div>
  );
}
