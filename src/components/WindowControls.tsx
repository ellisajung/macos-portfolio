import useWindowStore, { type WindowKey } from "#store/window";

const WindowControls = ({ target }: { target: WindowKey }) => {
  const closeWindow = useWindowStore((s) => s.closeWindow);

  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div className="minimize" />
      <div className="maximize" />
    </div>
  );
};
export default WindowControls;
