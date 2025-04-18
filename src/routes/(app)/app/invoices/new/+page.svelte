<!-- Super rich, static invoice creation page inspired by Incoicely -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex items-center justify-center">
  <div class="bg-white shadow-2xl rounded-3xl max-w-3xl w-full p-10 border border-blue-100">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-blue-800 tracking-tight">New Invoice</h1>
        <p class="text-gray-400 mt-1">Create a professional invoice for your client</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">DRAFT</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 mb-10">
      <div>
        <label class="block text-gray-600 font-semibold mb-2">Invoice Number</label>
        <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg font-mono text-gray-700">INV-0001</div>
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-2">Account</label>
        <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg text-gray-700">Acme Corporation</div>
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-2">Invoice Date</label>
        <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg text-gray-700">2025-04-19</div>
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-2">Due Date</label>
        <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg text-gray-700">2025-05-19</div>
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-2">Status</label>
        <div class="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-lg font-semibold w-fit">Unpaid</div>
      </div>
    </div>
    <div class="mb-10">
      <label class="block text-gray-600 font-semibold mb-3 text-lg">Line Items</label>
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-blue-50 text-blue-800">
              <th class="p-4 text-left font-semibold">Description</th>
              <th class="p-4 text-right font-semibold">Quantity</th>
              <th class="p-4 text-right font-semibold">Rate</th>
              <th class="p-4 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-blue-50 transition">
              <td class="p-4">Website Design</td>
              <td class="p-4 text-right">2</td>
              <td class="p-4 text-right">$500</td>
              <td class="p-4 text-right font-bold">$1,000</td>
            </tr>
            <tr class="border-b hover:bg-blue-50 transition">
              <td class="p-4">Hosting (1 year)</td>
              <td class="p-4 text-right">1</td>
              <td class="p-4 text-right">$120</td>
              <td class="p-4 text-right font-bold">$120</td>
            </tr>
            <tr class="hover:bg-blue-50 transition">
              <td class="p-4">Domain (1 year)</td>
              <td class="p-4 text-right">1</td>
              <td class="p-4 text-right">$20</td>
              <td class="p-4 text-right font-bold">$20</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end mt-4">
        <button class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 transition">+ Add Item</button>
      </div>
    </div>
    <div class="flex flex-col items-end mb-10">
      <div class="w-full max-w-xs">
        <div class="flex justify-between py-2 text-gray-600">
          <span>Subtotal</span>
          <span>$1,140</span>
        </div>
        <div class="flex justify-between py-2 text-gray-600">
          <span>Tax (10%)</span>
          <span>$114</span>
        </div>
        <div class="flex justify-between py-2 text-xl font-bold text-blue-800 border-t border-blue-100 mt-2">
          <span>Total</span>
          <span>$1,254</span>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <label class="block text-gray-600 font-semibold mb-2">Notes</label>
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">Thank you for your business!</div>
    </div>
    <div class="flex justify-end space-x-4">
      <button class="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold shadow hover:bg-gray-200 transition">Cancel</button>
      <button class="px-8 py-3 bg-blue-700 text-white rounded-lg font-bold shadow-lg hover:bg-blue-800 transition text-lg">Save Invoice</button>
    </div>
  </div>
</div>
