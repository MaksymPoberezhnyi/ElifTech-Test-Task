<template>
  <div class="container">
      <Form @update="getComments"/>
      <hr>
      <h3>Comments:</h3>
      <Comment
        v-for="(comment, index) in comments"
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
    created () {
        this.getComments()
    },
    methods: {
        getComments () {
            this.$fb.collection("comments")
                .get()
                .then((querySnapshot) => {
                    this.comments = []
                    querySnapshot.forEach((doc) => {
                        this.comments.push({ id: doc.id, ...doc.data() })
                    })
                })
        }
    }
}
</script>

<style>

</style>