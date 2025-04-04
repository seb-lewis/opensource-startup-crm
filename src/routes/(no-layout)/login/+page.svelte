<script>
	import '../../../app.css';

    import imgGoogle from '$lib/assets/images/google.svg';
    import imgLogo from '$lib/assets/images/logo.png';
    export let data;

  </script>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
    
    <img src="{imgLogo}" alt="Product Logo" class="mx-auto h-16 mb-4" />

    <p class="text-gray-600 text-sm mb-6">Free and OpenSource CRM from small medium business</p>

    <a href="{data['google_url']}"
       class="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
      <img src="{imgGoogle}" alt="Google" class="h-5 w-5">
      <span>Continue with Google</span>
    </a>

  </div>
</div>

  