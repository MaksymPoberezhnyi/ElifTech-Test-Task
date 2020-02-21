<template>
  <div class="container">
      <Form @addNew="addNew"/>
      <hr>
      <h3>Comments:</h3>
      <Comment
        v-for="(comment, index) in commentsSortedByDate"
        :key="index"
        :index="index"
        :comment="comment"
      />
  </div>
</template>

<script>
import Form from "@/components/comments/Form.vue"
import Comment from "@/components/comments/Comment.vue"

export default {
    data () {
		return {
			comments: []
		}
	}, 
    components: {
        Form,
        Comment
    },
    computed: {
        commentsSortedByDate () {
            return this.comments.sort((a,b) => (a.createdAt.seconds > b.createdAt.seconds) ? 1 : ((b.createdAt.seconds > a.createdAt.seconds) ? -1 : 0)); 
        }
    },
    created () {
        this.getComments()
    },
    methods: {
        getComments () {
            this.$fb.collection("comments")
                .get()
                .then((querySnapshot) => {
                    this.comments = []
                    querySnapshot.forEach(async (doc) => {
                        this.comments.push({ id: doc.id, ...doc.data(), ref: doc.ref.path })
                    })
                })
        },
        addNew (newMan) {
            this.comments.push(newMan)
        }
    }
}
</script>

<style>

</style>