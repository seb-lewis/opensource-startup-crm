<!-- Static Invoice Design Inspired by Invoicely -->

<div class="min-h-screen bg-gray-100 py-10">
  <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-10 relative">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold tracking-wide text-gray-800">INVOICE</h1>
        <div class="mt-2 text-sm text-gray-500">#INV-2025-001</div>
      </div>
      <div class="text-right">
        <div class="text-lg font-semibold text-gray-700">Acme Corporation</div>
        <div class="text-sm text-gray-500">123 Main Street<br>New York, NY 10001</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div>
        <div class="font-semibold text-gray-700 mb-1">Billed To:</div>
        <div class="text-gray-800">Beta LLC</div>
        <div class="text-gray-500 text-sm">456 Market Ave<br>San Francisco, CA 94111</div>
      </div>
      <div>
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Invoice Date:</span>
          <span>2025-04-01</span>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Due Date:</span>
          <span>2025-04-15</span>
        </div>
        <div class="flex justify-between text-sm text-gray-600">
          <span>Status:</span>
          <span class="font-semibold text-yellow-600">Unpaid</span>
        </div>
      </div>
    </div>
    <table class="w-full text-sm mb-8 border-t border-b border-gray-200">
      <thead>
        <tr class="bg-gray-50 text-gray-600 uppercase text-xs">
          <th class="py-3 px-2 text-left">Description</th>
          <th class="py-3 px-2 text-center">Qty</th>
          <th class="py-3 px-2 text-right">Rate</th>
          <th class="py-3 px-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100">
          <td class="py-3 px-2">Consulting Services</td>
          <td class="py-3 px-2 text-center">10</td>
          <td class="py-3 px-2 text-right">$100.00</td>
          <td class="py-3 px-2 text-right">$1,000.00</td>
        </tr>
        <tr class="border-b border-gray-100">
          <td class="py-3 px-2">Hosting</td>
          <td class="py-3 px-2 text-center">2</td>
          <td class="py-3 px-2 text-right">$100.00</td>
          <td class="py-3 px-2 text-right">$200.00</td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-col items-end space-y-1 mb-8">
      <div class="flex w-64 justify-between text-gray-700">
        <span>Subtotal:</span>
        <span>$1,200.00</span>
      </div>
      <div class="flex w-64 justify-between text-gray-700">
        <span>Tax (18%):</span>
        <span>$216.00</span>
      </div>
      <div class="flex w-64 justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
        <span>Total:</span>
        <span>$1,416.00</span>
      </div>
    </div>
    <div class="mt-8 text-gray-600 text-sm">
      <div class="font-semibold mb-1">Notes</div>
      <div>Thank you for your business. Please make the payment by the due date.</div>
    </div>
    <div class="absolute top-10 right-10">
      <a href="#" class="text-yellow-600 hover:underline text-sm font-semibold">Edit</a>
    </div>
    <div class="mt-10 text-center">
      <a href="/app/invoices" class="inline-block text-blue-600 hover:underline text-sm">&larr; Back to Invoices</a>
    </div>
  </div>
</div>
