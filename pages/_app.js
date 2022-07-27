import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Garden</p>
        <div className="flex mt-4">
          {/* <Link href="/">
            <a className="mr-6 text-pink-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">Sell digital Asset</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">My Assets</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">Creator Dashboard</a>
          </Link>
          <Link href="/create-sujet">
            <a className="mr-6 text-pink-500">Create Sujet</a>
          </Link>
          <Link href="/jardin">
            <a className="mr-6 text-pink-500">Jardin</a>
          </Link>
          <Link href="/create-plant">
            <a className="mr-6 text-pink-500">Create Plant</a>
          </Link> */}
          <Link href="/my-plants">
            <a className="mr-6 text-pink-500">My Plants</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
