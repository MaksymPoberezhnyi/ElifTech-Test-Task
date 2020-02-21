<template>
    <div class="comment--nested">
        <div>Published: {{ date }}</div>
        <div>Name: {{ comment.name }}</div>
        <div v-if="!isShowEditNested">Comment: {{ comment.text }}</div>
        <textarea class="form-control" name="" id="" v-else v-model="text" cols="30" rows="3"></textarea>
        <button class="btn btn-outline-success btn-sm mr-2 mt-2" v-if="isShowEditNested" @click="save()">Save</button>
        <button class="btn btn-outline-primary btn-sm mr-2 mt-2" @click="isShowEditNested = !isShowEditNested">{{ !isShowEditNested ? 'Edit' : 'Close' }}</button>
        <button class="btn btn-outline-info btn-sm mr-2 mt-2" @click="isShowNestedReply = !isShowNestedReply">{{ !isShowNestedReply ? 'Reply' : 'Close' }} </button>
        <button class="btn btn-outline-danger btn-sm mt-2" @click="suicide">Delete</button>
        <div v-if="isShowNestedReply">
            <input type="text" class="form-control btn-sm mb-2 mt-4" v-model="nameNestedReply"> 
            <textarea class="form-control btn-sm mb-2 mt-2" name="" id="" v-model="replyText" cols="30" rows="3"></textarea>
            <button class="btn btn-primary btn-sm mt-2" @click="send">Send reply</button>            
        </div>
        <NestedComment
            v-for="(nestedComment, index) in nestedPizduki"
            :key="index"
            :comment="nestedComment"
        />
    </div>  
</template>

<script>
import NestedComment from '@/components/comments/NestedComment.vue'

export default {
   name: 'NestedComment',
   components: {
       NestedComment
   },
   props: ['comment'],
   data () {
       return {
           isShowEditNested: false,
           isShowNestedReply: false,
           text: '',
           nameNestedReply: '',
           replyText: '',
           nestedPizduki: [],
           date: ''
        }
   },
   created () {
       this.getNested()
       this.date = moment(this.comment.createdAt.seconds * 1000).format('LLLL')
       this.text = this.comment.text
   },
   methods: {
       save () {
           this.$fb.doc(this.comment.ref).update({
               text: this.text
           }).then(() => {
               console.log("saved")
           })
       },
       suicide () {
           this.$fb.doc(this.comment.ref).delete().then(() => {
               console.log('deleted')
               this.$destroy()
               this.$el.parentNode.removeChild(this.$el)
           })
       },
       send () {
           let newComment = {
               name: this.nameNestedReply,
               text: this.replyText,
               createdAt: new window.firebase.firestore.Timestamp.now()
           }
           this.$fb.doc(this.comment.ref).collection('comments').add(newComment).then(() => {
               this.nameNestedReply = ''
               this.replyText = ''
               this.nestedPizduki = []
               this.getNested()
               this.isShowNestedReply = false
           })
       },
       getNested () {
           this.$fb.doc(this.comment.ref).collection('comments').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.nestedPizduki.push({ id: doc.id, ...doc.data(), ref: doc.ref.path })
                })
            })
       }
   }
}

</script>

<style>
    .comment--nested {
        margin: 10px 0 0 60px;
        margin-bottom: 10px;
        padding: 10px;
        border: 0;
        border-left: 1px solid #17a2b8;
        border-radius: 4px;
    }
</style>