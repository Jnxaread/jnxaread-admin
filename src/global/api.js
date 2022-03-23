export default {
    user: {
        login: '/user/login',
        logout: '/user/logout',
        list: '/user/list',
    },
    library: {
        fictions: '/library/list/fiction',
        chapters: '/library/list/chapter',
        comments: '/library/list/comment',
        categories: '/library/list/category',
        latestFictions: '/library/list/fiction/latest',
        fictionDetail: '/library/detail/fiction',
        chapterDetail: '/library/detail/chapter',
        fictionBrief: '/library/brief/fiction',
        chapterBrief: '/library/brief/chapter',
        newFiction: '/library/new/fiction',
        newChapter: '/library/new/chapter',
        newComment: '/library/new/comment',
        newCategory: '/library/new/category',
        editChapter: '/library/edit/chapter',
        hideChapter: '/library/hide/chapter',
        deleteChapter: '/library/delete/chapter',
    },
    forum: {
        boards: '/forum/list/board',
        notices: '/forum/list/notice',
        latestTopics: '/forum/list/topic/latest',
        noticeDetail: '/forum/detail/notice',
        hideNotice: "/forum/hide/notice",
        lockNotice: "/forum/lock/notice",
        addOrUpdateNotice: "/forum/notice/addOrUpdate",
        newReply: '/forum/new/reply',
        newBoard: '/forum/new/board',
        topNotice: '/forum/notice/upToTop',
        deleteReply: '/forum/reply/delete',
        topic: {
            list: '/forum/topic/list',
            detail: '/forum/topic/detail',
            visible: '/forum/topic/visible',
            lock: '/forum/topic/lock',
            delete: '/forum/topic/delete',
        },
    },
    project: {
        version: "/project/list/version",
        newVersion: "/project/new/version"
    }
};
