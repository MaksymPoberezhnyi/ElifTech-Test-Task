<template>
    <div class="comment">
         <!-- view comments -->
        <div>Published: {{ date }}</div>
        <div>Name: {{ comment.name }} </div>
        <div v-if="!isShowEdit">Comment: {{ text }}</div>
        <!-- editing mode -->
        <textarea class="form-control" name="" id="" v-else v-model="text" cols="30" rows="3"></textarea>
        <button class="btn btn-outline-success btn-sm mr-2 mt-2" v-if="isShowEdit" @click="saveComment">Save</button>
        <button class="btn btn-outline-primary btn-sm mr-2 mt-2" @click="isShowEdit = !isShowEdit">{{ !isShowEdit ? 'Edit' : 'Close' }}</button>
        <!-- reply mode -->
        <button class="btn btn-outline-info btn-sm mr-2 mt-2" @click="isShowReply = !isShowReply">{{ !isShowReply ? 'Reply' : 'Close' }} </button>
        <button class="btn btn-outline-danger btn-sm mt-2" @click="deleteComment">Delete</button>
        
        <div v-if="isShowReply">
            <input type="text" class="form-control btn-sm mb-2 mt-4" v-model="nameReply"> 
            <textarea class="form-control btn-sm mb-2 mt-2" name="" id="" v-model="replyText" cols="30" rows="3"></textarea>
            <button class="btn btn-primary btn-sm mt-2" @click="send">Send reply</button>            
        </div>

        <!-- view nested comments -->
        <div>
            <div class="d-flex justify-content-end align-items-center">
                <button v-if="nestedComments.length > 0" type="button" class="btn btn-outline-warning btn-sm mr-2 mt-2" id="toggle-btn" aria-expanded="false" data-toggle="collapse" @click="toggle">Close/Open reply</button>
            </div>
            <div :id="index" class="collapse">
                <NestedComment
                    v-for="(nestedComment, index) in nestedComments"
                    :key="index"
                    :comment="nestedComment"
                />
            </div>
        </div>   
    </div>
</template>

<script>

import NestedComment from "@/components/comments/NestedComment.vue"

export default {
    components: {
        NestedComment
    },
    props: ["comment", "index"],
    data () {
        return {
            isShowReply: false,
            isShowEdit: false,
            isShowNested: false,
            isShowEditNested: false,
            isShowNestedReply: false,
            nameReply: "",
            replyText: "",
            dbRef: this.$fb.collection("comments").doc(this.comment.id).collection("comments"),
            nestedComments: [],
            text: "",
            date: ""
        }
    },
    created () {
        this.text = this.comment.text
        this.date = moment(this.comment.createdAt.seconds * 1000).format('LLLL')
        this.getNestedComments()
    },
    mounted () {
        window.$('#' + this.index).collapse()
    },
    methods: {
        toggle () {
            window.$('#' + this.index).collapse('toggle')
        },
        send () {
            this.dbRef.add({
				name: this.nameReply,
                text: this.replyText,
                createdAt: new window.firebase.firestore.Timestamp.now().toDate()
			})
			.then(() => {
				this.nameReply = ''
                this.replyText = ''
                this.nestedComments = []
                this.getNestedComments()
                this.isShowReply = false
			})
        },
        getNestedComments () {
            this.dbRef
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.nestedComments.push({ id: doc.id, ...doc.data(), ref: doc.ref.path })
                    })
                })
        },
        deleteComment () {
            this.$fb.collection("comments").doc(this.comment.id)
            .delete()
            .then(() => {
                this.$destroy()
                this.$el.parentNode.removeChild(this.$el)
            })
        },
        saveComment () {
            this.$fb.collection("comments").doc(this.comment.id).update({
                text: this.text
            }).then(() => {
                this.isShowEdit = false
            })
        }
    }
}

</script>

<style>
    .comment {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #333;
        border-radius: 4px;
    }
    .collapse.in {
        display: block;
    }
</style>