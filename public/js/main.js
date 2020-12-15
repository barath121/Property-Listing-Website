window.onscroll = function(){navBody()}

function navBody() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        // document.getElementById('navBody').classList.remove('position-fixed', 'border-bottom')
        document.getElementById('navBody').classList.add('shadow', 'sticky-top')
    } else {
        document.getElementById('navBody').classList.remove('shadow', 'sticky-top')
        // document.getElementById('navBody').classList.add('position-fixed', 'border-bottom')
    }
}