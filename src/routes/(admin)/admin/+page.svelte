<script>
    import { Plus, Edit, Trash2, Eye, FileText, TrendingUp } from '@lucide/svelte';
    
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    
    // Mock data for demonstration
    const stats = [
        { title: 'Total Posts', value: '24', change: '+12%', icon: FileText, color: 'blue' },
        { title: 'Published', value: '18', change: '+8%', icon: Eye, color: 'green' },
        { title: 'Drafts', value: '6', change: '+4%', icon: Edit, color: 'orange' },
        { title: 'Total Views', value: '12.4K', change: '+23%', icon: TrendingUp, color: 'purple' },
    ];
    
    const blogPosts = [
        { id: 1, title: 'Getting Started with BottleCRM', status: 'Published', views: 1234, date: '2024-01-15', author: 'John Doe' },
        { id: 2, title: 'Advanced CRM Features', status: 'Draft', views: 0, date: '2024-01-14', author: 'Jane Smith' },
        { id: 3, title: 'Customer Success Stories', status: 'Published', views: 856, date: '2024-01-13', author: 'Mike Johnson' },
        { id: 4, title: 'API Integration Guide', status: 'Published', views: 2341, date: '2024-01-12', author: 'Sarah Wilson' },
        { id: 5, title: 'Best Practices for CRM', status: 'Draft', views: 0, date: '2024-01-11', author: 'John Doe' },
    ];
    
    function getStatusColor(status) {
        return status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    }
    
    function getStatColor(color) {
        const colors = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500'
        };
        return colors[color] || 'bg-gray-500';
    }
</script>

<svelte:head>
    <title>Blog Management - BottleCRM</title>
</svelte:head>

<div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p class="mt-2 text-sm text-gray-600">Manage your blog posts and content</p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus class="w-4 h-4 mr-2" />
                New Post
            </button>
        </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each stats as stat}
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 {getStatColor(stat.color)} rounded-lg flex items-center justify-center">
                            <svelte:component this={stat.icon} class="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div class="ml-4 flex-1">
                        <p class="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div class="flex items-baseline">
                            <p class="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <span class="ml-2 text-sm font-medium text-green-600 flex items-center">
                                <TrendingUp class="w-3 h-3 mr-1" />
                                {stat.change}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Blog posts table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Blog Posts</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each blogPosts as post}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{post.title}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusColor(post.status)}">
                                    {post.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.views.toLocaleString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.date}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex items-center space-x-2">
                                    <button class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="View">
                                        <Eye class="w-4 h-4" />
                                    </button>
                                    <button class="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50" title="Edit">
                                        <Edit class="w-4 h-4" />
                                    </button>
                                    <button class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
                <button class="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span class="text-sm font-medium text-gray-900">Create New Blog Post</span>
                    <Plus class="w-4 h-4 text-gray-400" />
                </button>
                <button class="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span class="text-sm font-medium text-gray-900">Manage Categories</span>
                    <Edit class="w-4 h-4 text-gray-400" />
                </button>
                <button class="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span class="text-sm font-medium text-gray-900">View Blog Analytics</span>
                    <TrendingUp class="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900">New blog post published</p>
                        <p class="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900">Blog post updated</p>
                        <p class="text-xs text-gray-500">4 hours ago</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900">Draft saved</p>
                        <p class="text-xs text-gray-500">6 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>