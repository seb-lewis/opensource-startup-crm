<script>
  import { Briefcase, Edit3, Trash2, Clock, User, Building, Calendar, AlertCircle, MessageCircle, Send, CheckCircle, RotateCcw, XCircle } from '@lucide/svelte';
  
  export let data;
  let comment = '';
  let errorMsg = '';
  
  function getPriorityColor(priority) {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
  
  function getStatusIcon(status) {
    switch (status) {
      case 'OPEN': return AlertCircle;
      case 'IN_PROGRESS': return RotateCcw;
      case 'CLOSED': return CheckCircle;
      default: return AlertCircle;
    }
  }
</script>

<section class="min-h-screen bg-gray-50">
  <div class="container mx-auto p-4 max-w-5xl">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div class="flex items-start gap-4">
          <div class="p-3 bg-blue-50 rounded-lg">
            <Briefcase class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{data.caseItem.subject}</h1>
            <p class="text-gray-600 text-sm">Case #{data.caseItem.caseNumber}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <a href="/app/cases/{data.caseItem.id}/edit" 
             class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit3 class="w-4 h-4" />
            Edit
          </a>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Case Details -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Case Information</h2>
          
          {#if data.caseItem.description}
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">{data.caseItem.description}</p>
            </div>
          {/if}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Building class="w-4 h-4 text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-700">Account</p>
                  <p class="text-gray-900">{data.caseItem.account?.name || 'Not assigned'}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <User class="w-4 h-4 text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-700">Assigned to</p>
                  <p class="text-gray-900">{data.caseItem.owner?.name || 'Unassigned'}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              {#if data.caseItem.dueDate}
                <div class="flex items-center gap-3">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-700">Due Date</p>
                    <p class="text-gray-900">{(new Date(data.caseItem.dueDate)).toLocaleDateString()}</p>
                  </div>
                </div>
              {/if}
              
              <div class="flex items-center gap-3">
                <Clock class="w-4 h-4 text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-700">Created</p>
                  <p class="text-gray-900">{(new Date(data.caseItem.createdAt)).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <MessageCircle class="w-5 h-5 text-gray-600" />
            <h2 class="text-lg font-semibold text-gray-900">Comments</h2>
            <span class="text-sm text-gray-500">({data.caseItem.comments?.length || 0})</span>
          </div>
          
          <!-- Comments List -->
          <div class="space-y-4 mb-6">
            {#if data.caseItem.comments && data.caseItem.comments.length}
              {#each data.caseItem.comments as c}
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-blue-700 font-semibold text-sm">
                        {c.author?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="font-medium text-gray-900">{c.author?.name || 'Unknown User'}</p>
                        <span class="text-gray-400">•</span>
                        <p class="text-sm text-gray-500">{(new Date(c.createdAt)).toLocaleDateString()}</p>
                      </div>
                      <p class="text-gray-700 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-center py-8 text-gray-500">
                <MessageCircle class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to add one!</p>
              </div>
            {/if}
          </div>
          
          <!-- Add Comment Form -->
          <form method="POST" action="?/comment" class="border-t border-gray-200 pt-4">
            <div class="flex gap-3">
              <input 
                type="text" 
                name="body"
                bind:value={comment}
                placeholder="Write a comment..." 
                required
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Send class="w-4 h-4" />
                Post
              </button>
            </div>
            {#if errorMsg}
              <p class="text-red-600 text-sm mt-2">{errorMsg}</p>
            {/if}
          </form>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status & Priority -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Status & Priority</h3>
          
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Status</p>
              <div class="flex items-center gap-2">
                <svelte:component this={getStatusIcon(data.caseItem.status)} class="w-4 h-4" />
                <span class="px-3 py-1 rounded-full text-sm font-medium border {getStatusColor(data.caseItem.status)}">
                  {data.caseItem.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Priority</p>
              <span class="px-3 py-1 rounded-full text-sm font-medium border {getPriorityColor(data.caseItem.priority)}">
                {data.caseItem.priority}
              </span>
            </div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Case Created</p>
                <p class="text-xs text-gray-500">{(new Date(data.caseItem.createdAt)).toLocaleDateString()}</p>
              </div>
            </div>
            
            {#if data.caseItem.updatedAt && data.caseItem.updatedAt !== data.caseItem.createdAt}
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Last Updated</p>
                  <p class="text-xs text-gray-500">{(new Date(data.caseItem.updatedAt)).toLocaleDateString()}</p>
                </div>
              </div>
            {/if}
            
            {#if data.caseItem.closedAt}
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Case Closed</p>
                  <p class="text-xs text-gray-500">{(new Date(data.caseItem.closedAt)).toLocaleDateString()}</p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
