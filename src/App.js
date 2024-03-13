import TagsInput from "./components/TagsInput/TagsInput"

function App() {
  return (
    <div className="container">
      <h1>React Tags Input</h1>
      <TagsInput values={[]} onChange={tags => console.log(tags)} />
    </div>
  )
}

export default App;
