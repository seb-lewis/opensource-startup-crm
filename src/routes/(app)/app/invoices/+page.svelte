<!-- Super rich, modern invoice list design inspired by Incoicely. Static content only. -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
  <div class="max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-10">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Invoices</h1>
      <a href="#" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition">+ New Invoice</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Invoice Card 1 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-blue-600 relative overflow-hidden">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Unpaid</span>
          <span class="text-gray-400 text-sm">Due: 15 Apr 2025</span>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">INV-001</h2>
          <p class="text-gray-500">Acme Corp</p>
        </div>
        <div class="mb-4">
          <div class="flex justify-between text-gray-600 text-sm mb-1">
            <span>Consulting Services</span>
            <span>$1,000</span>
          </div>
          <div class="flex justify-between text-gray-600 text-sm mb-1">
            <span>Hosting</span>
            <span>$200</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-6">
          <div>
            <span class="text-xs text-gray-400">Issued:</span>
            <span class="text-sm text-gray-700">01 Apr 2025</span>
          </div>
          <div class="text-right">
            <span class="block text-xs text-gray-400">Total</span>
            <span class="text-2xl font-extrabold text-blue-700">$1,200</span>
          </div>
        </div>
        <div class="flex gap-4 mt-8">
          <a href="#" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition">View</a>
          <a href="#" class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition">Edit</a>
        </div>
        <div class="absolute right-0 top-0 opacity-10 text-[8rem] font-black text-blue-200 select-none pointer-events-none">💸</div>
      </div>
      <!-- Invoice Card 2 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-green-500 relative overflow-hidden">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">Paid</span>
          <span class="text-gray-400 text-sm">Paid: 20 Apr 2025</span>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">INV-002</h2>
          <p class="text-gray-500">Beta LLC</p>
        </div>
        <div class="mb-4">
          <div class="flex justify-between text-gray-600 text-sm mb-1">
            <span>Design</span>
            <span>$800</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-6">
          <div>
            <span class="text-xs text-gray-400">Issued:</span>
            <span class="text-sm text-gray-700">10 Apr 2025</span>
          </div>
          <div class="text-right">
            <span class="block text-xs text-gray-400">Total</span>
            <span class="text-2xl font-extrabold text-green-700">$800</span>
          </div>
        </div>
        <div class="flex gap-4 mt-8">
          <a href="#" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition">View</a>
          <a href="#" class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition">Edit</a>
        </div>
        <div class="absolute right-0 top-0 opacity-10 text-[8rem] font-black text-green-200 select-none pointer-events-none">✅</div>
      </div>
    </div>
  </div>
</div>
