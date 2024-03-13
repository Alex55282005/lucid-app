import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';


const Counter = (props) => {
    const [responseData, setData] = useState(() => []);
    const [result, setResult] = useState('');
    const tags = props.data;
    let strCount = "";
    let newArr = [];

    useEffect(() => {
        axios.get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
          .then((response )=> {
            setData(response.data);
          })
          .catch(error => {
            console.error('Request error:', error);
          });
      }, []);

    const checkTag = (tagValue) => {
      const regex = /[\+\-\/\*\(\)\^\%\=\;]/; 
      return !regex.test(tagValue);
    };

    for (let i = 0; i < tags.length; i++) {
        const bool = checkTag(tags[i]);
        if (!bool) {
            strCount += tags[i];
            newArr.push(tags[i]);
        }else if (bool) {
            for (let j = 0; j < responseData.length; j++) {
                if (responseData[j].name == tags[i]) {
                    strCount += responseData[j].value;   
                    newArr.push(responseData[j].value);
                };
            };
        };       
    };
    return (<div>
        The result is: {strCount}
    </div>);
};

export default Counter;