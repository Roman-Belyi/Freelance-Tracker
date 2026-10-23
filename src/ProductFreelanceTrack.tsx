import { useState, useRef, useEffectEvent } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { uk } from 'zod/locales'
z.config(uk())

console.log('FreelanceUpwork - mini V0.4.1')


//------------------------------------------------------------------------------------------------------------------//

//VERSION V0.4.6
//ADDED: Migration on TYPESCRIPT (TSX)
//NEW FEATURES: Typezation, fix bugs

// DATA GIGS //
const mockGigs = [
  {
    author: 'System',
    id: 1,
    title: "Create a minimalist logo design",
    price: 45,
    status: "new",
    done: false,
    priority: 3,
    notes: "Client wants black and white + brand name in Nike-style font",
    tags: 'HTML,posts,design',
    addedAt: "2025-02-10",
    canDoneTime: null
  },
  {
     author: 'System2',
    id: 2,
    title: "Write 1000 product reviews for Etsy",
    price: 120,
    status: "in-progress",
    done: false,
    priority: 2,
    notes: "Write 50 per day, deadline in 20 days",
    tags: 'HTML,posts,design',
    addedAt: "2025-02-08",
    canDoneTime: null
  },
  {
     author: 'System3',
    id: 3,
    title: "Edit a short TikTok video (15 sec)",
    price: 25,
    status: "finished",
    done: true,
    priority: 1,
    notes: "Client is happy, wants 3 more videos",
    tags: 'HTML,parcel,design',
    addedAt: "2025-02-09",
    canDoneTime: null
  },
  {
     author: 'System4',
    id: 4,
    title: "Design 5 Instagram posts + stories",
    price: 70,
    status: "paid",
    done: true,
    priority: 2,
    notes: "Client left a 5⭐ review",
    tags:'HTML,posts,design',
    addedAt: "2025-02-07",
    canDoneTime: null
  }
];
//

  //USESTORE MAIN LOGIC ZUSTAND//
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
//

//ADD CUSTOM GIG FORM//

//ZOD SCHEMA//
    const createOwnGigs_User = z.object({
       author: z.string().min(2, 'Minimum 2 symbols!').max(25,'Maximum 25 symbols!'),
       title: z.string().min(4, 'Title must have minimum 4 symbols.').max(100, 'Title could keep 100 symbols!'),
       price: z.coerce.number().min(15, 'Min price is - 15 dollar/euro/uan/rub/ron/cny/pls').max(99999, 'Max price is - 99999 dollar/euro/uan/rub/ron/cny/pls '),
       notes: z.string().max(1250).optional().transform(val => val === "" ? undefined : val),
       tags: z.string().max(30).optional(),
       priority: z.coerce.number().min(1).max(5),
    })
    //

    //USESTATES OF FORM//
function CreateFormComponent(){
    const [author,setAuthor] = useState('')
    const [title,setTitle] = useState('')
    const [price,setPrice] = useState(0)
    const [notes,setNotes] = useState('')
    const [priority,setPriority] = useState(3)
    const [tags,setTags] = useState('')
    const [errors, setErrors] = useState({})
    const formRef = useRef(null)

    function createForm(e){
      e.preventDefault()
      const resultGigs_User = createOwnGigs_User.safeParse({
         author: author,
         title: title,
         price: parseInt(price),
         notes: notes,
         priority: priority,
         tags: tags,
      })

      if(!resultGigs_User.success){
        const errors = z.flattenError(resultGigs_User.error)
        setErrors(errors.fieldErrors || {})
        console.log('Form parsing error ! ')
        return
      }
      const newGig_System = {
        ...resultGigs_User.data,
        id: crypto.randomUUID(),
        status: 'new',
        done: false,
        addedAt: new Date().toISOString().slice(0,10)
      }


      console.log("New gig:", newGig_System)
      useStore.getState().add_gig(newGig_System)
       setAuthor('')
       setTitle('')
       setPrice(0)
       setNotes('')
       setTags('')
       setPriority(1)
       setErrors({})
       formRef.current.focus()
    }


    return(
      <section className="create-box">
        <form onSubmit={createForm}>
          <div className="author-input">
            <label htmlFor="author">Author:</label>
            <input name="author" type="text" ref={formRef} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter your name/surname..." required/>
            <span id="char-counter" style={{ fontSize: '12px', color: '#666' }}>
             Symbols left: {25 - author.length} out {25}
            </span>
            {errors.author && <span style={{ color: 'red' }}>{errors.author[0]}</span>}
          </div>

          <div className="title-input">
            <label htmlFor='title'>Title:</label>
            <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter you description..." required/>
            <span id="desc-counter" style={{ fontSize: '12px', color: '#666' }}>
             Symbols: {title.length} / 500
            </span>
            {errors.title && <span style={{ color: 'red' }}>{errors.title[0]}</span>}
          </div>

          <div className="price--note-input">
            <div className="price">
             <label htmlFor="price">Price:</label>
             <input type="number" name="price" value={price} placeholder="Your price:" onChange={(e) => setPrice(e.target.value)} required  />
             {errors.price && <span style={{ color: 'red' }}>{errors.price[0]}</span>}
            </div>

            <div className="notes">
              <label htmlFor="note">Notes:</label>
              <input type="text" name="note" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter additional notes" />
            </div>
            {errors.notes && <span style={{ color: 'red' }}>{errors.notes[0]}</span>}
          </div>

         <div className="tags">
          <label htmlFor="tag">Tags:</label>
          <input type="text" name="tag" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Enter main tags"  />
          {errors.tags && <span style={{ color: 'red' }}>{errors.tags[0]}</span>}
         </div>

          <div className="priority">
            <p>Priority: {priority}</p>
            <button type="button" onClick={() => setPriority(prev => prev < 5 ? prev + 1 : prev)}>+1</button>
            <button type="button" onClick={() => setPriority(prev => prev > 1 ? prev - 1 : prev)}>-1</button>
            {errors.priority && <span style={{ color: 'red' }}>{errors.priority[0]}</span>}
          </div>

          <button type="submit">Create</button>
        </form>
      </section>
    )
}

  //MAIN RENDER APP//
    export default  function FreelanceUpworkMini() {
        const localStor = useStore((s) => s.balance)
      return (
        <div>
          <div className='vacancys-box'>
           <h1>Fiverr Freelance Tracker v0.6.4 (Beta)</h1>
           <p>Balance: {localStor} $</p>
           <AllVacancy />
      </div>

      <div className="custom-box">
        <CreateFormComponent/>
      </div>
    </div>
  );
}


//<---------------------------------------------------------------------------------------------------->//
