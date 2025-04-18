<!-- Super Rich Invoice List Page - Uniform Blue-Purple Theme -->
<div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
  <div class="max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-10">
      <h1 class="text-4xl font-extrabold text-blue-900 tracking-tight">Invoices</h1>
      <a href="#" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-800 hover:to-purple-800 transition">+ New Invoice</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Invoice Card 1 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border-t-8 border-blue-600 relative overflow-hidden">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Unpaid</span>
          <span class="text-blue-500 text-sm">Due: 15 Apr 2025</span>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-blue-900">INV-001</h2>
          <p class="text-blue-500">Acme Corp</p>
        </div>
        <div class="mb-4">
          <div class="flex justify-between text-blue-700 text-sm mb-1">
            <span>Service</span><span>$1,000</span>
          </div>
          <div class="flex justify-between text-blue-700 text-sm mb-1">
            <span>Hosting</span><span>$200</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-6">
          <div class="font-bold text-blue-800">Total</div>
          <div class="text-right text-lg font-extrabold text-purple-700">$1,200</div>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition font-semibold">Edit</button>
          <button class="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition">Download</button>
        </div>
        <div class="absolute right-0 top-0 opacity-10 text-[8rem] font-black text-blue-200 select-none pointer-events-none">💸</div>
      </div>
      <!-- Invoice Card 2 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border-t-8 border-green-500 relative overflow-hidden">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full">Paid</span>
          <span class="text-green-500 text-sm">Due: 10 Mar 2025</span>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-green-900">INV-002</h2>
          <p class="text-green-500">Beta LLC</p>
        </div>
        <div class="mb-4">
          <div class="flex justify-between text-green-700 text-sm mb-1">
            <span>Design</span><span>$800</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-6">
          <div class="font-bold text-green-800">Total</div>
          <div class="text-right text-lg font-extrabold text-green-700">$800</div>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-full shadow hover:from-green-700 hover:to-green-500 transition font-semibold">View</button>
        </div>
        <div class="absolute right-0 top-0 opacity-10 text-[8rem] font-black text-green-200 select-none pointer-events-none">✅</div>
      </div>
    </div>
  </div>
</div>
