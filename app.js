
const state={role:null,page:"dashboard"};
const demo={
 customer:{name:"Budi Santoso",username:"PYG-00001",package:"Home 20 Mbps",status:"Aktif",bill:145000,due:"20 September 2026"},
 admin:{name:"Administrator",username:"admin"},
 teknisi:{name:"Andi Teknisi",username:"TKN-001"}
};
const menu={
 customer:[["dashboard","Dashboard"],["bill","Tagihan"],["payment","Pembayaran"],["ticket","Lapor Gangguan"],["profile","Profil"]],
 admin:[["dashboard","Dashboard"],["customers","Pelanggan"],["packages","Paket Internet"],["bills","Tagihan"],["payments","Pembayaran"],["tickets","Tiket Gangguan"],["technicians","Teknisi"],["reports","Laporan"]],
 teknisi:[["dashboard","Dashboard"],["tickets","Pekerjaan"],["profile","Profil"]]
};
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}
function login(role){
 state.role=role;state.page="dashboard";save("pnet_session",role);render()
}
function logout(){localStorage.removeItem("pnet_session");state.role=null;render()}
function nav(p){state.page=p;render()}
function statusBadge(s){
 let c=s==="Aktif"||s==="Selesai"||s==="Disetujui"?"active":s==="Isolir"||s==="Ditolak"?"isolir":s==="Diproses"?"process":"pending";
 return `<span class="badge ${c}">${s}</span>`
}
function loginPage(){
 document.getElementById("app").innerHTML=`<div class="login"><div class="login-card">
 <div class="logo">⚡ Payangan Net</div><h1>Portal Layanan</h1><p class="muted">Versi 1 — Customer, Admin & Teknisi</p>
 <div class="field"><label>Username</label><input id="username" placeholder="Masukkan username"></div>
 <div class="field"><label>Password</label><input id="password" type="password" placeholder="Masukkan password"></div>
 <button class="btn primary" style="width:100%" onclick="doLogin()">Masuk</button>
 <div class="demo"><b>Demo login</b><br>Customer: <b>PYG-00001</b> / 123456<br>Admin: <b>admin</b> / admin123<br>Teknisi: <b>TKN-001</b> / 123456</div>
 </div></div>`
}
function doLogin(){
 const u=document.getElementById("username").value,p=document.getElementById("password").value;
 if(u==="PYG-00001"&&p==="123456") login("customer");
 else if(u==="admin"&&p==="admin123") login("admin");
 else if(u==="TKN-001"&&p==="123456") login("teknisi");
 else alert("Username atau password demo salah.")
}
function shell(){
 const d=demo[state.role];
 return `<div class="layout"><aside class="sidebar"><div class="brand">⚡ Payangan Net</div><div class="muted" style="color:#9fb1c8;margin-bottom:12px">${state.role.toUpperCase()}</div><div class="nav">
 ${menu[state.role].map(x=>`<button class="${state.page===x[0]?'active':''}" onclick="nav('${x[0]}')">${x[1]}</button>`).join("")}
 </div><button class="btn danger" style="width:100%;margin-top:25px" onclick="logout()">Keluar</button></aside>
 <main class="main"><div class="top"><div><h1 style="margin:0">${pageTitle()}</h1><div class="user">Payangan Net Management System</div></div><div class="user">${d.name} · <b>${d.username}</b></div></div><div id="content">${content()}</div></main>
 <div class="mobile-nav">${menu[state.role].slice(0,4).map(x=>`<button onclick="nav('${x[0]}')">${x[1]}</button>`).join("")}<button onclick="logout()">Keluar</button></div></div>`
}
function pageTitle(){return (menu[state.role].find(x=>x[0]===state.page)||["","Dashboard"])[1]}
function customerContent(){
 const bills=get("pnet_bills",[]);
 if(state.page==="dashboard") return `<div class="grid">
 <div class="card stat">Status Layanan<b>${statusBadge(demo.customer.status)}</b></div>
 <div class="card stat">Tagihan Berjalan<b>Rp ${demo.customer.bill.toLocaleString("id-ID")}</b></div>
 <div class="card stat">Jatuh Tempo<b>${demo.customer.due}</b></div>
 <div class="card stat">Paket<b>${demo.customer.package}</b></div></div>
 <div class="section card"><h2>Informasi</h2><p>Selamat datang di portal pelanggan Payangan Net. Silakan lakukan pembayaran sebelum jatuh tempo untuk menghindari isolir.</p><button class="btn primary" onclick="nav('bill')">Lihat Tagihan</button></div>
 <div class="section card"><h2>Gangguan / Maintenance</h2><p class="muted">Tidak ada gangguan aktif yang diinformasikan saat ini.</p></div>`;
 if(state.page==="bill") return `<div class="card"><h2>Tagihan Berjalan</h2><table class="table"><tr><th>Invoice</th><th>Periode</th><th>Nominal</th><th>Jatuh Tempo</th><th>Status</th></tr><tr><td>INV-2026-09-00001</td><td>September 2026</td><td>Rp 145.000</td><td>20 Sep 2026</td><td>${statusBadge("Menunggu")}</td></tr></table><br><button class="btn primary" onclick="nav('payment')">Bayar / Kirim Bukti</button></div>
 <div class="section card"><h2>Riwayat Tagihan</h2><p>Agustus 2026 — Rp 145.000 — ${statusBadge("Disetujui")}</p><p>Juli 2026 — Rp 145.000 — ${statusBadge("Disetujui")}</p></div>`;
 if(state.page==="payment") return `<div class="card"><h2>Kirim Bukti Pembayaran</h2><div class="form-grid"><div class="field"><label>Metode Pembayaran</label><select><option>BCA</option><option>GoPay</option><option>QRIS</option></select></div><div class="field"><label>Nominal</label><input value="145000"></div><div class="field full"><label>Bukti Pembayaran</label><input type="file" id="proof"></div></div><button class="btn primary" onclick="submitPayment()">Kirim Bukti</button></div>
 <div class="section card"><h2>Rekening Pembayaran</h2><p>BCA — Akbar Putra Bahrudin</p><p>GoPay — Akbar Putra Bahrudin</p><p>QRIS — Payangan Network</p></div>`;
 if(state.page==="ticket") return `<div class="card"><h2>Pengajuan Gangguan</h2><div class="form-grid"><div class="field"><label>Jenis Gangguan</label><select id="tType"><option>Internet tidak terhubung</option><option>Internet lambat</option><option>WiFi bermasalah</option><option>Lainnya</option></select></div><div class="field"><label>Prioritas</label><select id="tPriority"><option>Normal</option><option>Tinggi</option></select></div><div class="field full"><label>Keterangan</label><textarea id="tDesc" rows="4" placeholder="Jelaskan kendala..."></textarea></div></div><button class="btn primary" onclick="submitTicket()">Kirim Laporan</button></div><div class="section card"><h2>Status Laporan</h2><p>TK-00001 · Internet tidak terhubung · ${statusBadge("Diproses")}</p></div>`;
 return `<div class="card"><h2>Profil Pelanggan</h2><p><b>Nama:</b> Budi Santoso</p><p><b>Username:</b> PYG-00001</p><p><b>Paket:</b> Home 20 Mbps</p><p><b>Alamat:</b> Payangan</p><p><b>Kontak:</b> 08xxxxxxxxxx</p></div>`
}
function adminContent(){
 if(state.page==="dashboard") return `<div class="grid"><div class="card stat">Total Pelanggan<b>191</b></div><div class="card stat">Aktif<b>176</b></div><div class="card stat">Isolir<b>12</b></div><div class="card stat">Suspend<b>3</b></div></div><div class="section grid"><div class="card"><b>Tagihan bulan ini</b><h2>Rp 27.695.000</h2><span class="muted">Generate otomatis setiap bulan</span></div><div class="card"><b>Pembayaran menunggu</b><h2>8</h2><button class="btn primary" onclick="nav('payments')">Verifikasi</button></div></div>`;
 if(state.page==="customers") return `<div class="card"><button class="btn primary" onclick="alert('Form tambah pelanggan siap dikembangkan ke database.')">+ Tambah Pelanggan</button></div><div class="section table-wrap"><table class="table"><tr><th>ID</th><th>Nama</th><th>Paket</th><th>Status</th><th>Tagihan</th></tr><tr><td>PYG-00001</td><td>Budi Santoso</td><td>Home 20 Mbps</td><td>${statusBadge("Aktif")}</td><td>Rp 145.000</td></tr><tr><td>PYG-00002</td><td>Siti Aminah</td><td>Home 30 Mbps</td><td>${statusBadge("Aktif")}</td><td>Rp 175.000</td></tr></table></div>`;
 if(state.page==="packages") return `<div class="section grid"><div class="card"><h3>Home 20 Mbps</h3><h2>Rp 145.000</h2><p class="muted">Internet rumah</p></div><div class="card"><h3>Home 30 Mbps</h3><h2>Rp 175.000</h2><p class="muted">Internet rumah</p></div><div class="card"><h3>Home 50 Mbps</h3><h2>Rp 225.000</h2><p class="muted">Internet rumah</p></div></div>`;
 if(state.page==="bills") return `<div class="card"><button class="btn primary" onclick="alert('Generate tagihan bulan berjalan berhasil (demo).')">⚡ Generate Tagihan Bulanan</button><button class="btn secondary" style="margin-left:8px" onclick="alert('Tanggal jatuh tempo default: 20 setiap bulan.')">Setting Jatuh Tempo</button></div><div class="section card"><h2>Rekap Tagihan September 2026</h2><p>Total tagihan: <b>191 pelanggan</b></p><p>Estimasi: <b>Rp 27.695.000</b></p></div>`;
 if(state.page==="payments") return `<div class="section table-wrap"><table class="table"><tr><th>Invoice</th><th>Pelanggan</th><th>Nominal</th><th>Metode</th><th>Status</th><th>Aksi</th></tr><tr><td>INV-2026-09-00001</td><td>Budi Santoso</td><td>Rp 145.000</td><td>BCA</td><td>${statusBadge("Menunggu")}</td><td><button class="btn success" onclick="verifyPayment('Disetujui')">Setujui</button> <button class="btn danger" onclick="verifyPayment('Ditolak')">Tolak</button></td></tr></table></div>`;
 if(state.page==="tickets") return `<div class="section table-wrap"><table class="table"><tr><th>Tiket</th><th>Pelanggan</th><th>Gangguan</th><th>Prioritas</th><th>Status</th><th>Teknisi</th></tr><tr><td>TK-00001</td><td>Budi Santoso</td><td>Internet tidak terhubung</td><td>Tinggi</td><td>${statusBadge("Diproses")}</td><td>Andi Teknisi</td></tr></table></div>`;
 if(state.page==="technicians") return `<div class="grid"><div class="card"><h3>Andi Teknisi</h3><p>TKN-001</p><p>${statusBadge("Aktif")}</p><p>18 pekerjaan bulan ini</p></div><div class="card"><h3>Fahmi Teknisi</h3><p>TKN-002</p><p>${statusBadge("Aktif")}</p><p>15 pekerjaan bulan ini</p></div></div>`;
 return `<div class="grid"><div class="card"><h3>Pemasukan</h3><h2>Rp 25.800.000</h2><p class="muted">September 2026</p></div><div class="card"><h3>Ticket selesai</h3><h2>46</h2><p class="muted">Bulan berjalan</p></div></div><div class="section card"><button class="btn secondary" onclick="alert('Export Excel/PDF siap diintegrasikan.')">Export Excel / PDF</button></div>`
}
function techContent(){
 if(state.page==="dashboard") return `<div class="grid"><div class="card stat">Pekerjaan Baru<b>4</b></div><div class="card stat">Diproses<b>3</b></div><div class="card stat">Selesai<b>18</b></div><div class="card stat">Bulan Ini<b>25</b></div></div><div class="section card"><h2>Pekerjaan Prioritas</h2><p>TK-00001 · Budi Santoso · Internet tidak terhubung · ${statusBadge("Diproses")}</p><button class="btn primary" onclick="nav('tickets')">Lihat Pekerjaan</button></div>`;
 if(state.page==="tickets") return `<div class="section table-wrap"><table class="table"><tr><th>Tiket</th><th>Pelanggan</th><th>Lokasi</th><th>Gangguan</th><th>Prioritas</th><th>Status</th><th>Aksi</th></tr><tr><td>TK-00001</td><td>Budi Santoso</td><td>Payangan</td><td>Internet tidak terhubung</td><td>Tinggi</td><td>${statusBadge("Diproses")}</td><td><button class="btn success" onclick="alert('Status pekerjaan diubah menjadi Selesai (demo).')">Selesaikan</button></td></tr><tr><td>TK-00002</td><td>Siti Aminah</td><td>Payangan</td><td>Internet lambat</td><td>Normal</td><td>${statusBadge("Menunggu")}</td><td><button class="btn primary" onclick="alert('Pekerjaan diterima teknisi.')">Terima</button></td></tr></table></div>`;
 return `<div class="card"><h2>Profil Teknisi</h2><p><b>Nama:</b> Andi Teknisi</p><p><b>ID:</b> TKN-001</p><p><b>Area:</b> Payangan</p></div>`
}
function content(){return state.role==="customer"?customerContent():state.role==="admin"?adminContent():techContent()}
function render(){
 if(!state.role) return loginPage();
 document.getElementById("app").innerHTML=shell()
}
function submitPayment(){alert("Bukti pembayaran berhasil dikirim. Status: Menunggu verifikasi admin.")}
function verifyPayment(s){alert("Pembayaran diubah menjadi: "+s)}
function submitTicket(){alert("Laporan gangguan berhasil dibuat. Nomor tiket: TK-00002")}
const session=get("pnet_session",null); if(session) state.role=session; render();
