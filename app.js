const ADMIN_USERS = {
  "Yooaan": "Yooaan@123",
  "Hissan": "Hissan@123"
};

function defaultFlights(){
  return [
    makeFlight('Q2-101','MLE','GAN','Malé','Gan','2026-06-15','09:30','A320',36),
    makeFlight('Q2-103','MLE','DXB','Malé','Dubai','2026-06-18','14:15','A320',42),
    makeFlight('Q2-105','MLE','CMB','Malé','Colombo','2026-06-20','19:45','A320',30)
  ];
}
function makeFlight(no,from,to,fromCity,toCity,date,time,aircraft,totalSeats){
  return {id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()), no, from, to, fromCity, toCity, date, time, aircraft, price:0, status:'Scheduled', seats: createSeats(totalSeats)};
}
function createSeats(total){
  const letters=['A','B','C','D','E','F']; const seats={}; let n=0;
  for(let row=1;n<total;row++){ for(const l of letters){ if(n>=total) break; seats[l+row]='available'; n++; } }
  return seats;
}
function getFlights(){let f=JSON.parse(localStorage.getItem('flights')||'null'); if(!f){f=defaultFlights();saveFlights(f)} return f}
function saveFlights(f){localStorage.setItem('flights',JSON.stringify(f))}
function getBookings(){return JSON.parse(localStorage.getItem('bookings')||'[]')}
function saveBookings(b){localStorage.setItem('bookings',JSON.stringify(b))}

function availableCount(f){return Object.values(f.seats).filter(s=>s==='available').length}
function bookedCount(f){return Object.values(f.seats).filter(s=>s==='booked').length}
function renderFlights(){ const box=document.getElementById('flightList'); const flights=getFlights(); box.innerHTML=flights.map(f=>`<div class="flight-card"><div><div class="route">${f.from} → ${f.to}</div><div class="muted">${f.fromCity} to ${f.toCity}</div></div><div><b>${f.no}</b><div class="muted">${f.aircraft}</div></div><div><b>${formatDate(f.date)}</b><div class="muted">${f.time}</div></div><div><div class="free">0 Robux</div><div class="muted">${availableCount(f)} seats left</div></div><button onclick="startBooking('${f.id}')">Book Free</button></div>`).join('') || '<div class="panel">No flights scheduled.</div>'}
function startBooking(id){localStorage.setItem('selectedFlight',id); location.href='booking.html'}
function renderBookingPage(){ const id=localStorage.getItem('selectedFlight'); const f=getFlights().find(x=>x.id===id); const box=document.getElementById('bookingFlight'); if(!f){box.innerHTML='<p>Flight not found. Go back to Flights.</p>';return} box.innerHTML=`<div class="flight-card" style="grid-template-columns:1fr"><div class="route">${f.from} → ${f.to}</div><div>${f.no} • ${formatDate(f.date)} • ${f.time}</div><div class="free">Fare: 0 Robux</div><div class="muted">Available seats: ${availableCount(f)}</div></div>`; }
function assignSeat(seats){return Object.keys(seats).find(k=>seats[k]==='available') || null}
function confirmBooking(){ const flightId=localStorage.getItem('selectedFlight'); const name=document.getElementById('passengerName').value.trim(); const discord=document.getElementById('discordUsername').value.trim(); if(!name||!discord) return alert('Please enter Roblox username and Discord username.'); const flights=getFlights(); const f=flights.find(x=>x.id===flightId); if(!f) return alert('Flight not found.'); const seat=assignSeat(f.seats); if(!seat) return alert('Sorry, this flight is full.'); f.seats[seat]='booked'; const ref='MLD'+Math.random().toString(36).slice(2,7).toUpperCase(); const booking={ref, flightId, flightNo:f.no, from:f.from, to:f.to, fromCity:f.fromCity, toCity:f.toCity, date:f.date, time:f.time, passenger:name, discord, seat, fare:'0 Robux', status:'Confirmed'}; const bookings=getBookings(); bookings.push(booking); saveFlights(flights); saveBookings(bookings); localStorage.setItem('lastBooking',ref); alert('Booking confirmed! Seat '+seat+' assigned. Fare: 0 Robux.'); location.href='my-bookings.html'}
function renderMyBookings(){ const box=document.getElementById('bookingList'); const bookings=getBookings().slice().reverse(); box.innerHTML=bookings.map(passHTML).join('') || '<div class="panel">No bookings yet.</div>'}
function passHTML(b){return `<div class="boarding-pass"><div class="pass-head"><img src="assets/logo.png" style="width:150px;filter:brightness(0) invert(1)"><div>Booking Reference</div><h2>${b.ref}</h2></div><div class="pass-body"><b>${b.passenger}</b><div class="muted">Passenger</div><div class="pass-route"><span>${b.from}</span><span>→</span><span>${b.to}</span></div><div class="pass-grid"><div><span class="muted">Flight</span><br><b>${b.flightNo}</b></div><div><span class="muted">Seat</span><br><b>${b.seat}</b></div><div><span class="muted">Date</span><br><b>${formatDate(b.date)}</b></div><div><span class="muted">Time</span><br><b>${b.time}</b></div><div><span class="muted">Fare</span><br><b class="free">0 Robux</b></div><div><span class="muted">Status</span><br><b>${b.status}</b></div></div></div></div>`}
function formatDate(d){return new Date(d+'T00:00:00').toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}

function initAdmin(){ if(localStorage.getItem('adminUser') && ADMIN_USERS[localStorage.getItem('adminUser')]) showAdmin('dashboard'); }
function adminLogin(){ const user=document.getElementById('adminUser').value.trim(); const pass=document.getElementById('adminPass').value; if(ADMIN_USERS[user] !== pass) return alert('Wrong username or password.'); localStorage.setItem('adminUser',user); showAdmin('dashboard')}
function adminLogout(){ localStorage.removeItem('adminUser'); location.reload(); }
function adminWrap(html){document.getElementById('adminLogin').classList.add('hidden'); const c=document.getElementById('adminContent'); c.classList.remove('hidden'); c.innerHTML=html}
function showAdmin(page){ if(!localStorage.getItem('adminUser')) return; const flights=getFlights(), bookings=getBookings(); if(page==='dashboard') adminWrap(`<p class="eyebrow">Welcome ${localStorage.getItem('adminUser')}</p><h1>Dashboard</h1><div class="dashboard-grid"><div class="stat-card"><span>Total Flights</span><h2>${flights.length}</h2></div><div class="stat-card"><span>Total Bookings</span><h2>${bookings.length}</h2></div><div class="stat-card"><span>Fare</span><h2>0 Robux</h2></div><div class="stat-card"><span>Available Seats</span><h2>${flights.reduce((a,f)=>a+availableCount(f),0)}</h2></div></div>${flightTable(flights)}`);
 if(page==='newFlight') adminWrap(`<h1>Create Flight</h1><div class="panel"><div class="form-grid"><input id="no" placeholder="Flight No Q2-101"><input id="aircraft" placeholder="Aircraft A320"><input id="from" placeholder="From MLE"><input id="to" placeholder="To GAN"><input id="fromCity" placeholder="From City Malé"><input id="toCity" placeholder="To City Gan"><input id="date" type="date"><input id="time" type="time"><input id="seats" type="number" placeholder="Seats e.g. 36"></div><button class="btn" onclick="createFlightAdmin()">Create Free Flight</button></div>`);
 if(page==='seats') adminWrap(`<h1>Seat Management</h1><p class="muted">Click a seat to block/unblock. Booked seats cannot be changed here.</p><select id="seatFlight" onchange="renderSeatManager()">${flights.map(f=>`<option value="${f.id}">${f.no} ${f.from}→${f.to}</option>`).join('')}</select><div id="seatManager"></div>`), renderSeatManager();
 if(page==='bookings') adminWrap(`<h1>Bookings</h1>${bookingTable(bookings)}`);
}
function flightTable(flights){return `<table class="table"><tr><th>Flight</th><th>Route</th><th>Date</th><th>Time</th><th>Seats</th><th>Price</th><th></th></tr>${flights.map(f=>`<tr><td>${f.no}</td><td>${f.from}→${f.to}</td><td>${formatDate(f.date)}</td><td>${f.time}</td><td>${bookedCount(f)} booked / ${availableCount(f)} free</td><td class="free">0 Robux</td><td><button class="danger" onclick="deleteFlight('${f.id}')">Delete</button></td></tr>`).join('')}</table>`}
function bookingTable(bookings){return `<table class="table"><tr><th>Roblox</th><th>Discord</th><th>Flight</th><th>Seat</th><th>Date</th><th>Ref</th><th>Fare</th></tr>${bookings.map(b=>`<tr><td>${b.passenger}</td><td>${b.discord}</td><td>${b.flightNo}</td><td>${b.seat}</td><td>${formatDate(b.date)}</td><td>${b.ref}</td><td class="free">0 Robux</td></tr>`).join('')}</table>`}
function createFlightAdmin(){ const f=makeFlight(val('no'),val('from'),val('to'),val('fromCity'),val('toCity'),val('date'),val('time'),val('aircraft'),Number(val('seats')||36)); const flights=getFlights(); flights.push(f); saveFlights(flights); alert('Flight created. Price fixed at 0 Robux.'); showAdmin('dashboard')}
function val(id){return document.getElementById(id).value.trim()}
function deleteFlight(id){ if(!confirm('Delete this flight?'))return; saveFlights(getFlights().filter(f=>f.id!==id)); showAdmin('dashboard')}
function renderSeatManager(){ const id=document.getElementById('seatFlight').value; const f=getFlights().find(x=>x.id===id); const div=document.getElementById('seatManager'); if(!f){div.innerHTML='No flight selected';return} div.innerHTML=`<div class="panel"><b>${f.no} ${f.from}→${f.to}</b><p class="muted">Available ${availableCount(f)} • Booked ${bookedCount(f)}</p><button onclick="addSeats('${f.id}')">Add 6 Seats</button> <button class="danger" onclick="removeAvailableSeat('${f.id}')">Remove 1 Available Seat</button><div class="seat-grid">${Object.entries(f.seats).map(([seat,status])=>`<div class="seat ${status}" onclick="toggleSeat('${f.id}','${seat}')">${seat}</div>`).join('')}</div><p class="small">White = available, grey = booked, black = blocked.</p></div>`}
function toggleSeat(fid,seat){ const flights=getFlights(); const f=flights.find(x=>x.id===fid); if(f.seats[seat]==='booked') return alert('Booked seats cannot be blocked. Cancel booking first.'); f.seats[seat]= f.seats[seat]==='blocked' ? 'available' : 'blocked'; saveFlights(flights); renderSeatManager()}
function addSeats(fid){ const flights=getFlights(); const f=flights.find(x=>x.id===fid); const existing=Object.keys(f.seats); let row=1; while(['A','B','C','D','E','F'].some(l=>existing.includes(l+row))) row++; ['A','B','C','D','E','F'].forEach(l=>f.seats[l+row]='available'); saveFlights(flights); renderSeatManager()}
function removeAvailableSeat(fid){ const flights=getFlights(); const f=flights.find(x=>x.id===fid); const seat=Object.keys(f.seats).reverse().find(s=>f.seats[s]==='available'||f.seats[s]==='blocked'); if(!seat) return alert('No removable seats.'); delete f.seats[seat]; saveFlights(flights); renderSeatManager()}
