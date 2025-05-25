<!-- Super Rich Invoice View Page - Uniform Blue-Purple Theme -->
<div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-10">
  <div class="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 relative border border-blue-200">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold tracking-wide text-blue-900">INVOICE</h1>
        <div class="mt-2 text-sm text-blue-500">#INV-2025-001</div>
      </div>
      <div class="text-right">
        <div class="text-lg font-semibold text-blue-800">Acme Corporation</div>
        <div class="text-sm text-blue-500">123 Main Street<br>New York, NY 10001</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div>
        <div class="font-semibold text-blue-700 mb-1">Billed To:</div>
        <div class="text-blue-900">Beta LLC</div>
        <div class="text-blue-500 text-sm">456 Market Ave<br>San Francisco, CA 94111</div>
      </div>
      <div>
        <div class="flex justify-between text-sm text-blue-600 mb-1">
          <span>Status:</span><span class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">Unpaid</span>
        </div>
        <div class="flex justify-between text-sm text-blue-600 mb-1">
          <span>Invoice Date:</span><span>2025-04-01</span>
        </div>
        <div class="flex justify-between text-sm text-blue-600">
          <span>Due Date:</span><span>2025-04-15</span>
        </div>
      </div>
    </div>
    <table class="w-full text-sm mb-8 border-t border-b border-blue-200">
      <thead>
        <tr class="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 uppercase text-xs">
          <th class="p-3 text-left">Description</th>
          <th class="p-3 text-right">Quantity</th>
          <th class="p-3 text-right">Rate</th>
          <th class="p-3 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-blue-100 hover:bg-blue-50/60">
          <td class="p-3">Consulting Services</td>
          <td class="p-3 text-right">10</td>
          <td class="p-3 text-right">$100</td>
          <td class="p-3 text-right font-semibold text-blue-800">$1,000</td>
        </tr>
        <tr class="border-b border-blue-100 hover:bg-blue-50/60">
          <td class="p-3">Hosting</td>
          <td class="p-3 text-right">2</td>
          <td class="p-3 text-right">$100</td>
          <td class="p-3 text-right font-semibold text-blue-800">$200</td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-col items-end space-y-1 mb-8">
      <div class="flex w-64 justify-between text-blue-700">
        <span>Subtotal:</span>
        <span>$1,200.00</span>
      </div>
      <div class="flex w-64 justify-between text-lg font-bold text-purple-700 border-t border-blue-200 pt-2">
        <span>Total:</span>
        <span>$1,200.00</span>
      </div>
    </div>
    <div class="mt-8 text-blue-600 text-sm">
      <div class="font-semibold mb-1">Notes</div>
      <div>Thank you for your business. Please make the payment by the due date.</div>
    </div>
    <div class="absolute top-10 right-10">
      <a href="." class="text-purple-600 hover:underline text-sm font-semibold">Edit</a>
    </div>
    <div class="mt-10 text-center">
      <a href="/app/invoices" class="inline-block text-blue-600 hover:underline text-sm">&larr; Back to Invoices</a>
    </div>
  </div>
</div>
