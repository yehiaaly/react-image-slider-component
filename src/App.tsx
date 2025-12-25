import ImageSlider from "./components/image-slider/ImageSlider";

const App = () => {
  return (
    <div>
      <ImageSlider url={"https://picsum.photos/v2/list"} limit={10} />
    </div>
  );
};

export default App;
