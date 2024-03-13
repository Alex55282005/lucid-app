import React from "react";
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { useQuery } from 'react-query'; 
import "./TagsInput.css"
import axios from 'axios';
import Counter from "./TagsCount";



const useTagStore = create(devtools(set => ({
  tags: [],
  setTags: tags => set({ tags }),
  addTag: newTag => set(state => ({ tags: [...state.tags, newTag] })),
  removeTag: index => set(state => ({ tags: state.tags.filter((_, i) => i !== index) }))
})));

const useAutocompleteStore = create((set) => ({
    inputValue: '',
    setInputValue: (value) => set({ inputValue: value }),
  }));

const fetchData = async (inputValue) => {
    const response = await axios.get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    const filteredData = response.data.filter(item => item.name.toLowerCase().includes(inputValue));
    return filteredData;
  };

const TagsInput = ({ values, onChange, color }) => {

  const { tags, addTag, removeTag } = useTagStore();
  const [tag, setTag] = React.useState('');
  const { inputValue, setInputValue } = useAutocompleteStore();
  const [toCount, setCounter] = React.useState(false);
  
  const { data, isLoading } = useQuery(['autocompleteData', inputValue], () => fetchData(inputValue));

  const handleChange = e => {
    const { value } = e.target;
    setInputValue(value);
    setTag(value);
    setCounter(false)
  };

  const handleKeyDown = e => {
    const { key } = e;
    const newTag = tag.trim();

    if ((key === ',' || key === 'Enter' || key === 'Tab') && newTag.length && !tags.includes(newTag)) {
      e.preventDefault();
      addTag(newTag);
      onChange([...tags, newTag]);
      setTag('');
    } else if (key === 'Backspace' && !newTag.length && tags.length) {
      e.preventDefault();
      const lastTag = tags[tags.length - 1];
      removeTag(tags.length - 1);
      onChange(tags.slice(0, -1));
      setTag(lastTag);
    }
  };

  const checkTag = (tagValue) => {
    const regex = /[\+\-\/\*\(\)\^\%\=\;]/; 
    return !regex.test(tagValue);
  };

  const submitTagList = e => {
    const { innerHTML } = e.target;
    console.log(innerHTML);
    addTag(innerHTML);
    setTag("")
    setCounter(false)
  }


  const setCount = () => {
    setCounter(true)
  };

  return (
    <div className="container">
        <div className="tags-input-wrapper">
          {tags.map((tag, index) => (
            <div key={index} className={checkTag(tag)? `tag-item color-default`: "tag-item color-none"}>
              <span className="title">{tag}{checkTag(tag)?<input className="inputX" type="text" role="textbox" placeholder="x"/> : "" }</span>
              <button className={checkTag(tag)? "remove-btn": "displayNone"} onClick={() => removeTag(index)}>&times;</button>
            </div>
          ))}
          <input value={tag} onChange={handleChange} className="tag-input" onKeyDown={handleKeyDown} />
        </div>
        {isLoading ? (
        <div className="autoComplite">Loading...</div>
      ) : (
        <ul className="autoComplite">
          {data?.map((item) => (
            <li value={item.name} className="listItem" onClick={submitTagList}>{item.name}</li>
          ))}
        </ul>
      )}
      <div className="count-btn" onClick={setCount}>Count Values</div>
      {
        toCount? <Counter data={tags}/> : <div></div>
      }
      
    </div>
  );
};

export default TagsInput;
