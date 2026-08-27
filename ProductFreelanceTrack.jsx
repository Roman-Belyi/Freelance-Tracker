import { useState, useRef, useImperativeHandle, forwardRef, useEffect, createContext, useContext, useReducer, useEffectEvent } from 'react';
import { flushSync } from 'react-dom';
import {create} from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {produce} from 'immer'
import {persist} from 'zustand/middleware'
import {z} from 'zod'
import { uk } from "zod/locales"
z.config(uk());

console.log('FreelanceUpwork - mini V0.4.1')


//----------------------------------------------------------------------------------------------------------//

//VERSION V0.4.1
//ADDED: ZUSTAND UPDATE
//NEW FEATURES: USESHALLOW,CREATE,USESTORE, Global State


//DATA GIGS//
const mockGigs = [
  {
    author: 'System',
    id: 1,
    title: "Сделать крутой логотип в стиле минимализм",
    price: 45,
    status: "new",             
    done: false,
    priority: 3,                
    notes: "Клиент хочет чёрно-белый + название шрифтом как у Nike",
    tags: 'HTML,posts,design',
    addedAt: "2025-02-10",
    canDoneTime: null
  },
  {
     author: 'System2',
    id: 2,
    title: "Написать 1000 отзывов для магазина на Etsy",
    price: 120,
    status: "in-progress",      
    done: false,
    priority: 2,
    notes: "Делать по 50 в день, дедлайн через 20 дней",
    tags: 'HTML,posts,design',
    addedAt: "2025-02-08",
    canDoneTime: null
  },
  {
     author: 'System3',
    id: 3,
    title: "Монтаж короткого TikTok-видео (15 сек)",
    price: 25,
    status: "finished",             
    done: true,
    priority: 1,
    notes: "Клиент доволен, просит ещё 3 видео",
    tags: 'HTML,parcel,design',
    addedAt: "2025-02-09",
    canDoneTime: null
  },
  {
     author: 'System4',
    id: 4,
    title: "Создать 5 постов для Instagram + сторис",
    price: 70,
    status: "paid",             
    done: true,
    priority: 2,
    notes: "Клиент оставил 5⭐ отзыв",
    tags:'HTML,posts,design',
    addedAt: "2025-02-07",
    canDoneTime: null
  }
];
//

  //MAIN LOGIC ZUSTAND//
  const useStore = create(persist((set,get) => ({
     gigs: mockGigs,
     balance: 0,

     like: (id) => set((state) => ({gigs: state.gigs.map(g => g.id === id ? {...g, priority: g.priority + 1} : g )})),
     dislike: (id) => set((state) => ({gigs: state.gigs.map(g => g.id === id ? {...g, priority: g.priority - 1} : g)})),
     save: (id) => set((state) => ({gigs: state.gigs.map(g => g.id === id && g.status === 'new' ? {...g, status: 'in-progress',canDoneTime: Date.now() + 60000 }: g )})),
     done: (id) => set((state) => {
        const gig = state.gigs.find(g => g.id === id);
        if (!gig || gig.status !== 'in-progress') return state;
        return {...state,balance: state.balance + gig.price, gigs: state.gigs.map(g => g.id === id ? {...g, status: 'finished', done: true} : g)}
     }),
     add_gig: (newGig) => set((state) => ({...state,gigs: [...state.gigs, newGig]})),
     delete_gig: (id) => set((state) => ({...state,gigs: [...state.gigs.filter(g => g.id !== id)]})),
  }),{name: 'freelance_tracker'}))

//

    //GIGS COMPONENT//
    function AllVacancy() {
        const {gigs,balance} = useStore(useShallow((s) => ({
             balance: s.balance,
             gigs: s.gigs,
        })))

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuary,setSearchQuery] = useState('')

    const filteredGigs = gigs.filter(gig => {
    const matchSelected =  selectedStatus === 'all' || gig.status === selectedStatus;
    const matchQuery = gig.tags.toLowerCase().includes(searchQuary.toLowerCase());

    return matchSelected && matchQuery
    });
 
  
     function HandleStatus(e) {
        setSelectedStatus(e.target.value);
       }


          const onEvent = useEffectEvent(() =>{
               alert('Deadline is coming soon!')
         })
  return (
    <div>
      <h1>Vacancys</h1>
      <p>Your trusted Upwork.</p>

       <div className="search--tag-box">
         <label>Search gig by tag:</label>
         <input type="text" value={searchQuary} onChange={(e) => setSearchQuery(e.target.value.trim())} placeholder="Search by tag..." />
      </div>

      <div className="filter-box">
        <select onChange={HandleStatus} value={selectedStatus}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="paid">Paid</option>
          <option value="in-progress">In-progress</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div className="vacancies">
        <ul>
          {filteredGigs.map(list => (
            <div key={list.id} className="gig-card">
              <h2 className="author-name">Author: {list.author}</h2>
              <h2 className="title">Title:{list.title}</h2>
              <p>Price:{list.price} $</p>
              <div className="status">Status:{list.status}</div>
              <p>Done:{list.done ? '✓' : '✗'}</p>
              <div>Priority:{list.priority}</div>
              <div>Note:{list.notes}</div>
              <div>Tags: {list.tags}</div>
              <time className="time">Added:{list.addedAt}</time>


              <button onClick={() => useStore.getState().like(list.id)}>Like </button>
              <button onClick={() => useStore.getState().dislike(list.id)}>DisLike </button>
              <button onClick={(e) => {e.preventDefault(); onEvent(); useStore.getState().save(list.id)} }>Save</button>
              <button type="button" disabled={list.status !== 'in-progress' || (list.canDoneTime && Date.now() < list.canDoneTime)} onClick={() => useStore.getState().done(list.id)}>Done</button>
              <button type="button" onClick={() => useStore.getState().delete_gig(list.id)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

//ADD CUSTOM GIG FORM//

function CreateFormComponent(){
    const [author,setAuthor] = useState('')
    const [title,setTitle] = useState('')
    const [price,setPrice] = useState(0)
    const [notes,setNotes] = useState('')
    const [priority,setPriority] = useState(3)
    const [tags,setTags] = useState('')
    const formRef = useRef(null)

    function createForm(e){
      e.preventDefault()
      const numericPrice = parseInt(price)
      if(numericPrice > 100000){
        alert('Unacceptable price!')
        console.error('Price must be less than one hundred thousand')
        return
      }
      const newGig = {
        author: author,
        id: crypto.randomUUID(),
        title: title,
        price: numericPrice,
        status: 'new',
        done: false,
        priority: priority,
        notes: notes,
        tags:tags,
        addedAt: new Date().toISOString().slice(0,10)
      }
      console.log("New gig:", newGig)
      useStore.getState().add_gig(newGig)
       setAuthor('')
       setTitle('')
       setPrice(0)
       setNotes('')
       setTags('')
       setPriority(1)
       formRef.current.focus()
    }

    return(
      <section className="create-box">
        <form onSubmit={createForm}>
          <div className="author-input">
            <label htmlFor="author">Author:</label>
            <input name="author" type="text" ref={formRef} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter your name/surname..." minLength={3} maxLength={25} required/>
            <span id="char-counter" style={{ fontSize: '12px', color: '#666' }}>
             Symbols left: {25 - author.length} out {25}
            </span>
          </div>

          <div className="title-input">
            <label htmlFor='title'>Title:</label>
            <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={500} placeholder="Enter you description..." required/>
            <span id="desc-counter" style={{ fontSize: '12px', color: '#666' }}>
             Symbols: {title.length} / 500
            </span>
          </div>

          <div className="price--note-input">
            <div className="price">
             <label htmlFor="price">Price:</label>
             <input type="number" name="price" value={price} min="500" max="100000" placeholder="Your price:" onChange={(e) => setPrice(e.target.value)} required  />
            </div>

            <div className="notes">
              <label htmlFor="note">Notes:</label>
              <input type="text" name="note" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter additional notes"  maxLength={100}/>
            </div>
          </div>
          
         <div className="tags">
          <label htmlFor="tag">Tags:</label>
          <input type="text" name="tag" value={tags} onChange={(e) => {const value = e.target.value; if (value.length >= 30) { alert('Maximum tags used!'); return  } setTags(value); }} placeholder="Enter main tags"  />
          
         </div>

          <div className="priority">
            <p>Priority: {priority}</p>
            <button type="button" onClick={() => setPriority(prev => prev < 5 ? prev + 1 : prev)}>+1</button>
            <button type="button" onClick={() => setPriority(prev => prev > 1 ? prev - 1 : prev)}>-1</button>
          </div>

          <button type="submit">Create</button>
        </form>
      </section>
    )
}

  //MAIN APP//
     function FreelanceUpworkMini() {
        const localStor = useStore((s) => s.balance) 
      return (
        <div>
          <div className='vacancys-box'>
           <h1>Fiverr Freelance Tracker v0.6.1 (Beta)</h1>
           <p>Balance: {localStor} $</p>
           <AllVacancy /> 
      </div>

      <div className="custom-box">
        <CreateFormComponent/>
      </div>
    </div>
  );
}

//----------------------------------------------------------------//