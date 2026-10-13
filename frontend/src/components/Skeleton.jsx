export default function Skeleton({ h = 14, w = "100%", r = 8 }) {
  return <span className="skel" style={{ height: h, width: w, borderRadius: r }} />;
}
