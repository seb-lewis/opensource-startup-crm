<!-- Super Rich Invoice List Page - Uniform Blue-Purple Theme -->
<div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
  <div class="max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-10">
      <h1 class="text-4xl font-extrabold text-blue-900 tracking-tight">Invoices</h1>
      <a href="." class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-800 hover:to-purple-800 transition">+ New Invoice</a>
    </div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <!-- Search -->
      <div class="flex-1 flex items-center bg-white/80 backdrop-blur-md rounded-xl shadow px-4 py-2 border border-blue-200">
        <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search invoices..." class="bg-transparent outline-none flex-1 text-blue-900 placeholder-blue-400" />
      </div>
      <!-- Status Filter -->
      <div class="flex items-center bg-white/80 backdrop-blur-md rounded-xl shadow px-4 py-2 border border-blue-200">
        <svg class="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
        <select class="bg-transparent outline-none text-blue-900 font-semibold">
          <option>All Statuses</option>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Overdue</option>
        </select>
      </div>
      <!-- Date Range -->
      <div class="flex items-center bg-white/80 backdrop-blur-md rounded-xl shadow px-4 py-2 border border-blue-200">
        <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <input type="text" placeholder="Date range" class="bg-transparent outline-none text-blue-900 placeholder-blue-400 w-28" />
      </div>
    </div>
    <div class="flex flex-col gap-5">
      <!-- Invoice Card 1 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-5 border-t-8 border-blue-600 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col gap-1 min-w-[120px]">
            <span class="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full w-fit">Unpaid</span>
            <span class="text-blue-500 text-xs">Due: 15 Apr 2025</span>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-blue-900 mb-0.5">INV-001</h2>
            <p class="text-blue-500 mb-1 text-sm">Acme Corp</p>
            <div class="mb-1">
              <div class="flex justify-between text-blue-700 text-xs mb-0.5">
                <span>Service</span><span>$1,000</span>
              </div>
              <div class="flex justify-between text-blue-700 text-xs mb-0.5">
                <span>Hosting</span><span>$200</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2 min-w-[120px]">
          <div class="flex items-center gap-1">
            <span class="font-bold text-blue-800 text-sm">Total</span>
            <span class="text-base font-extrabold text-purple-700">$1,200</span>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition font-semibold text-sm">Edit</button>
            <button class="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition text-sm">Download</button>
          </div>
        </div>
        <div class="absolute right-4 top-1 opacity-10 text-[5rem] font-black text-blue-200 select-none pointer-events-none">💸</div>
      </div>
      <!-- Invoice Card 2 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-5 border-t-8 border-green-500 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col gap-1 min-w-[120px]">
            <span class="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit">Paid</span>
            <span class="text-green-500 text-xs">Due: 10 Mar 2025</span>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-green-900 mb-0.5">INV-002</h2>
            <p class="text-green-500 mb-1 text-sm">Beta LLC</p>
            <div class="mb-1">
              <div class="flex justify-between text-green-700 text-xs mb-0.5">
                <span>Design</span><span>$800</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2 min-w-[120px]">
          <div class="flex items-center gap-1">
            <span class="font-bold text-green-800 text-sm">Total</span>
            <span class="text-base font-extrabold text-green-700">$800</span>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-1.5 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-full shadow hover:from-green-700 hover:to-green-500 transition font-semibold text-sm">View</button>
          </div>
        </div>
        <div class="absolute right-4 top-1 opacity-10 text-[5rem] font-black text-green-200 select-none pointer-events-none">✅</div>
      </div>
    </div>
    <!-- Pagination -->
    <div class="max-w-5xl mx-auto mt-12 flex justify-center">
      <nav class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl shadow px-6 py-3 border border-blue-200">
        <button class="px-3 py-1 rounded-full text-blue-400 hover:bg-blue-100 transition" disabled>&laquo;</button>
        <button class="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow">1</button>
        <button class="px-3 py-1 rounded-full text-blue-700 hover:bg-blue-100 transition">2</button>
        <button class="px-3 py-1 rounded-full text-blue-700 hover:bg-blue-100 transition">3</button>
        <span class="px-2 text-blue-400">...</span>
        <button class="px-3 py-1 rounded-full text-blue-700 hover:bg-blue-100 transition">10</button>
        <button class="px-3 py-1 rounded-full text-blue-700 hover:bg-blue-100 transition">&raquo;</button>
      </nav>
    </div>
  </div>
</div>
