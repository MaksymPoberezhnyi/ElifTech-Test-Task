<template>
    <div class="comment">
         <!-- view comments -->
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
                <button type="button" class="btn btn-outline-warning btn-sm mr-2 mt-2" id="toggle-btn" aria-expanded="false" data-toggle="collapse" @click="toggle">Close/Open reply</button>
            </div>
            <div :id="index" class="collapse">
                <div class="comment comment--nested"
                v-for="(nestedComment, index) in nestedComments"
                :key="index"
                :nestedComment="nestedComment"
                >
                    <div>Name: {{ nestedComment.name }}</div>
                    <div v-if="!isShowEditNested">Comment: {{ nestedComment.text }}</div>
                    <textarea class="form-control" name="" id="" v-else v-model="nestedComment.text" cols="30" rows="3"></textarea>
                    <button class="btn btn-outline-success btn-sm mr-2 mt-2" v-if="isShowEditNested" @click="saveNestedComment(nestedComment)">Save</button>
                    <button class="btn btn-outline-primary btn-sm mr-2 mt-2" @click="isShowEditNested = !isShowEditNested">{{ !isShowEditNested ? 'Edit' : 'Close' }}</button>
                    <button class="btn btn-outline-danger btn-sm mt-2" @click="deleteNestedComment(nestedComment.id)">Delete</button>
                </div> 
            </div>
        </div>   
    </div>
</template>

<script>
export default {
    props: ["comment", "index"],
    data () {
        return {
            isShowReply: false,
            isShowEdit: false,
            isShowNested: false,
            isShowEditNested: false,
            nameReply: "",
            replyText: "",
            dbRef: this.$fb.collection("comments").doc(this.comment.id).collection("comments"),
            nestedComments: [],
            text: "",
        }
    },
    created () {
        this.text = this.comment.text
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
            console.log(this.comment.id)
            this.dbRef.add({
				name: this.nameReply,
                text: this.replyText,
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
                        console.log(doc.data())
                        this.nestedComments.push({ id: doc.id, ...doc.data() })
                    })
                })
        },
        deleteComment () {
            this.$fb.collection("comments").doc(this.comment.id)
            .delete()
            .then(() => {
                console.log("deleted")
                this.$destroy()
                this.$el.parentNode.removeChild(this.$el)
            })
        },
        deleteNestedComment (id) {
            this.dbRef.doc(id)
            .delete()
            .then(() => {
                this.nestedComments = []
                this.getNestedComments()})
        },
        saveComment () {
            this.$fb.collection("comments").doc(this.comment.id).update({
                text: this.text
            }).then(() => {
                this.isShowEdit = false
            })
        },
        saveNestedComment (nestedComment) {
            this.$fb.collection("comments").doc(this.comment.id).collection("comments").doc(nestedComment.id).update({
                text: nestedComment.text
            }).then(() => {
                this.isShowEditNested = false
            })
        }
        
    }
}

</script>

<style scoped>
    .comment {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #333;
        border-radius: 4px;
    }
    .comment--nested {
        margin: 10px 0 0 60px;
        border: 0;
        border-left: 1px solid #17a2b8;
    }

    .collapse.in {
        display: block;
    }
</style>