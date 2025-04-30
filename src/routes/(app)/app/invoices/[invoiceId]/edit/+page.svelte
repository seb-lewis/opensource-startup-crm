<!-- Super Rich Invoice Edit Page - Incoicely-inspired, static content only -->

<div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4">
  <div class="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-200">
    <div class="px-8 py-8 bg-gradient-to-r from-blue-700 to-purple-600 text-white flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Edit Invoice</h1>
        <p class="text-sm opacity-80 mt-1">Invoice #INV-001</p>
      </div>
      <div class="text-right">
        <span class="inline-block px-4 py-1 rounded-full bg-white/30 font-semibold text-sm text-blue-900 shadow">Unpaid</span>
        <div class="mt-2 text-xs opacity-90">Due: 2025-04-15</div>
      </div>
    </div>
    <div class="px-8 py-10">
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div class="text-xs text-blue-500 font-semibold mb-1">Account</div>
          <div class="text-lg font-medium text-blue-900">Acme Corp</div>
        </div>
        <div>
          <div class="text-xs text-blue-500 font-semibold mb-1">Invoice Date</div>
          <div class="text-lg font-medium text-blue-900">2025-04-01</div>
        </div>
        <div>
          <div class="text-xs text-blue-500 font-semibold mb-1">Due Date</div>
          <div class="text-lg font-medium text-blue-900">2025-04-15</div>
        </div>
        <div>
          <div class="text-xs text-blue-500 font-semibold mb-1">Status</div>
          <div class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">Unpaid</div>
        </div>
      </div>
      <div class="mb-10">
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-bold text-blue-800">Line Items</div>
          <button class="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition font-semibold">+ Add Item</button>
        </div>
        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full bg-white/90">
            <thead>
              <tr class="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm">
                <th class="p-3 text-left font-semibold">Description</th>
                <th class="p-3 text-right font-semibold">Quantity</th>
                <th class="p-3 text-right font-semibold">Rate</th>
                <th class="p-3 text-right font-semibold">Total</th>
                <th class="p-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-blue-50/60">
                <td class="p-3">Consulting Services</td>
                <td class="p-3 text-right">10</td>
                <td class="p-3 text-right">$100</td>
                <td class="p-3 text-right font-semibold text-blue-800">$1,000</td>
                <td class="p-3 text-center text-purple-400 text-xl cursor-pointer hover:text-purple-700 transition">&times;</td>
              </tr>
              <tr class="border-b hover:bg-blue-50/60">
                <td class="p-3">Hosting</td>
                <td class="p-3 text-right">2</td>
                <td class="p-3 text-right">$100</td>
                <td class="p-3 text-right font-semibold text-blue-800">$200</td>
                <td class="p-3 text-center text-purple-400 text-xl cursor-pointer hover:text-purple-700 transition">&times;</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="p-3 text-right font-bold text-blue-700" colSpan="3">Total</td>
                <td class="p-3 text-right font-extrabold text-lg text-purple-700">$1,200</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="mb-8">
        <div class="text-xs text-blue-500 font-semibold mb-1">Notes</div>
        <div class="bg-blue-50 rounded-lg p-4 text-blue-900">Thank you for your business.</div>
      </div>
      <div class="flex justify-end">
        <button class="px-8 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:from-blue-800 hover:to-purple-800 transition text-lg">Save Invoice</button>
      </div>
    </div>
  </div>
</div>
