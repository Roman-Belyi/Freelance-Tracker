import { useState, useRef, useImperativeHandle, forwardRef, useEffect, createContext, useContext, useReducer, useEffectEvent } from 'react';
import { flushSync } from 'react-dom';
import {create} from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {produce} from 'immer'
import {persist} from 'zustand/middleware'
import {z} from 'zod'
import { uk } from "zod/locales"
z.config(uk());

console.log('FreelanceUpwork - mini V0.1.0')


//FREELANCE-PROJECT V0.1.0 -----------------------------------------------------------------------------------//
//MANAGING STATE//
//USEREDUCER//
//USE CONTEXT//
//CONTROLLED INPUT AND UNCONTOLLED/
//STATE STRUCUTURE//
//LIFTING SOURCE OF TRUTH//
//RESET AND PRESERVE STATE//


const mockGigs = [
  {
    id: 1,
    title: "Сделать крутой логотип в стиле минимализм",
    price: 45,
    status: "new",             
    done: false,
    priority: 3,                
    notes: "Клиент хочет чёрно-белый + название шрифтом как у Nike",
    addedAt: "2025-02-10",
    canDoneTime: null
  },
  {
    id: 2,
    title: "Написать 1000 отзывов для магазина на Etsy",
    price: 120,
    status: "in-progress",      
    done: false,
    priority: 2,
    notes: "Делать по 50 в день, дедлайн через 20 дней",
    addedAt: "2025-02-08",
    canDoneTime: null
  },
  {
    id: 3,
    title: "Монтаж короткого TikTok-видео (15 сек)",
    price: 25,
    status: "done",             
    done: true,
    priority: 1,
    notes: "Клиент доволен, просит ещё 3 видео",
    addedAt: "2025-02-09",
    canDoneTime: null
  },
  {
    id: 4,
    title: "Создать 5 постов для Instagram + сторис",
    price: 70,
    status: "paid",             
    done: true,
    priority: 2,
    notes: "Клиент оставил 5⭐ отзыв",
    addedAt: "2025-02-07",
    canDoneTime: null
  }
];

const initial = {
  gigs: mockGigs,
  balance: 0
};


function FreelanceUpworkMini(){

    function Reducer(state,action){
        const handlers = {
            LIKE: (state,action) =>  ({...state, gigs: state.gigs.map(type => type.id === action.payload ? {...type, priority: type.priority + 1} : type)}),
            DISLIKE: (state,action) => ({...state, gigs: state.gigs.map(type => type.id === action.payload ? {...type, priority: type.priority - 1} : type)}),
            SAVE: (state,action) => ({...state, gigs: state.gigs.map(type =>  type.id === action.payload && type.status === 'new' ? { ...type, status: 'in-progress', canDoneTime: Date.now() + 60000 }: type)}),
            DONE: (state,action) => {const gig = state.gigs.find(type => type.id === action.payload); if (!gig || gig.status !== 'in-progress') return state;  return {...state,  balance: state.balance + gig.price,  gigs: state.gigs.map(type => type.id === action.payload   ? { ...type, status: 'done', done: true }  : type )};}
        }

        const handler = handlers[action.type];
        return handler ? handler(state,action) : state
    }

    const [state, active] = useReducer(Reducer, initial)
    
   function  AllVacancy () {
    
       return(
        <div>
            <h1>Vacancys</h1>
            <p>Your trusted Upwork.</p>
             <div className="vacancies">
                <ul>{state.gigs.map(list => <div key={list.id} className="gig-card">
                    <h2 className="title">Title:{list.title}</h2>

                      <p>Price:{list.price}</p>

                    <div className="status">Status:{list.status}</div>

                        <p>Done:{list.done ? '✓' : '✗'}</p>

                    <div>Priority:{list.priority}</div>

                    <div>Note:{list.notes}</div>

                    <time className="time">Added:{list.addedAt}</time>

                    <button className="like" onClick={() => active({type:'LIKE', payload: list.id})}>Like img</button>

                    <button className="dislike" onClick={() => active({type:'DISLIKE', payload: list.id})}>DisLike img</button>

                    <button className="submit"  onClick={(e) => {e.preventDefault(); active({type: 'SAVE', payload: list.id})}}>Save</button>

                    <button type="button" disabled={list.status !== 'in-progress' || (list.canDoneTime && Date.now() < list.canDoneTime)} className="done" onClick={() => active({type: 'DONE', payload: list.id})}>Done</button>
                </div>)}</ul>
             </div>
        </div>
       )
   }

   return (
  <div>
    <h1>Fiverr Tracker v2.0 (Beta)</h1>
    <p>Balance: {state.balance} $</p>
    <AllVacancy />
  </div>
);
}

