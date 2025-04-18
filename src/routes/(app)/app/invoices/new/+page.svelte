<!-- Super Rich Invoice Creation Page - Uniform Blue-Purple Theme -->
<div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 flex items-center justify-center">
  <div class="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl max-w-3xl w-full p-10 border border-blue-200">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-blue-800 tracking-tight">New Invoice</h1>
        <p class="text-blue-400 mt-1">Create a professional invoice for your client</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">DRAFT</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 mb-10">
      <div>
        <label class="block text-blue-600 font-semibold mb-2">Invoice Number</label>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-lg font-mono text-blue-900">INV-0001</div>
      </div>
      <div>
        <label class="block text-blue-600 font-semibold mb-2">Account</label>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-lg text-blue-900">Acme Corporation</div>
      </div>
      <div>
        <label class="block text-blue-600 font-semibold mb-2">Invoice Date</label>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-lg text-blue-900">2025-04-01</div>
      </div>
      <div>
        <label class="block text-blue-600 font-semibold mb-2">Due Date</label>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-lg text-blue-900">2025-04-15</div>
      </div>
      <div>
        <label class="block text-blue-600 font-semibold mb-2">Status</label>
        <div class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">Draft</div>
      </div>
    </div>
    <div class="mb-10">
      <label class="block text-blue-600 font-semibold mb-3 text-lg">Line Items</label>
      <div class="overflow-x-auto rounded-xl border border-blue-200 shadow-sm bg-white/90">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm">
              <th class="p-3 text-left font-semibold">Description</th>
              <th class="p-3 text-right font-semibold">Quantity</th>
              <th class="p-3 text-right font-semibold">Rate</th>
              <th class="p-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-blue-50/60">
              <td class="p-3">Consulting Services</td>
              <td class="p-3 text-right">10</td>
              <td class="p-3 text-right">$100</td>
              <td class="p-3 text-right font-semibold text-blue-800">$1,000</td>
            </tr>
            <tr class="border-b hover:bg-blue-50/60">
              <td class="p-3">Hosting</td>
              <td class="p-3 text-right">2</td>
              <td class="p-3 text-right">$100</td>
              <td class="p-3 text-right font-semibold text-blue-800">$200</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="p-3 text-right font-bold text-blue-700" colSpan="3">Total</td>
              <td class="p-3 text-right font-extrabold text-lg text-purple-700">$1,200</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="flex justify-end mt-4">
        <button class="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition font-semibold">+ Add Item</button>
      </div>
    </div>
    <div class="flex flex-col items-end mb-10">
      <div class="w-full max-w-xs">
        <div class="flex justify-between text-blue-700 mb-2">
          <span>Subtotal:</span>
          <span>$1,200.00</span>
        </div>
        <div class="flex justify-between text-lg font-bold text-purple-700 border-t border-blue-200 pt-2">
          <span>Total:</span>
          <span>$1,200.00</span>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <label class="block text-blue-600 font-semibold mb-2">Notes</label>
      <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900">Thank you for your business!</div>
    </div>
    <div class="flex justify-end space-x-4">
      <button class="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition">Cancel</button>
      <button class="px-8 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg font-bold shadow-lg hover:from-blue-800 hover:to-purple-800 transition text-lg">Save Invoice</button>
    </div>
  </div>
</div>
