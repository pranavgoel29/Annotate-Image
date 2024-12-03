import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Welcome to the Annotation Tool</h1>
      <Link to="/annotate">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Start Annotating
        </button>
      </Link>
    </main>
  );
}
