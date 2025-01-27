//추천 레시피 리스트 페이지
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { data, useLocation, useNavigate } from 'react-router-dom';
import FoodCardComponent from '../Components/FoodCardComponent';
import { useGlobal, useRefresh } from '../contexts/GlobalContext';

const fetchRecommendQuery = async (prefer : string, user_id : string) => {
  const session_data = sessionStorage.getItem("rrr");
  if (session_data == null) {
    const response = await fetch('http://localhost:4000/services/api/ask_recipe',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user_id, preference : prefer })
      });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const return_val = response.json();
    return return_val;
  }
  else {
    const response = await fetch('http://localhost:4000/services/food/recommend',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food_data : JSON.parse(session_data) })
      });
    
      const return_val = response.json();
      return return_val;
  }
};
  
function useRecommendQuery (prefer : string, user_id : string) {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['recommend'],  // 데이터 캐시 키
    queryFn: () => fetchRecommendQuery(prefer, user_id), // 데이터를 가져오는 함수
  });

  if (isLoading) {
    return <div>추천 음식을 생각해보는중입니다!</div>;
  }

  if (isError) {
    return <div>Recommend Error: {error.message}</div>;
  }

  //if (data){
    console.log("end");
    const data_tmp = data["item"];
    const data_list = data_tmp.map(
        (item : JSON, idx : number) => 
          (<FoodCardComponent item={item} from="recommend"></FoodCardComponent>));
    sessionStorage.setItem("rrr", JSON.stringify(data));
        
    return data_list;
  //}
}

const Recommend: React.FC = () => {
  sessionStorage.setItem("LocationData", "recommend");
  const {globalVariable, setGlobalVariable} = useGlobal();
  const {state} = useLocation();
  const {preference} = state;
  const { refresh, setRefresh } = useRefresh();
  const navigate = useNavigate();
  if (refresh === "recommend") {
    console.log("refreshed")
    navigate(0);
    setRefresh("");
  }

  const recommend_list = useRecommendQuery(preference, globalVariable);
  
  return (
    <div className="app-container">
      
      {/* 카드 레이아웃 */}
      <div className="card-container">
        {recommend_list}
      </div>
    </div>
  );
};

export default Recommend;
