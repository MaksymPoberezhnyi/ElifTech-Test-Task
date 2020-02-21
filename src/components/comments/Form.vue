<template>
  <div>
	<div class="form-group">
        <label for="nameInput">Insert your name:</label>
        <input type="text" class="form-control" id="nameInput" v-model="name">
    </div>
	<div class="form-group">
        <label for="commentTextarea">Insert your comment:</label>
        <textarea class="form-control" id="commentTextarea" v-model="text" cols="30" rows="3"></textarea>
    </div>
	<button class="btn btn-primary" @click="send">Send comment</button>
  </div>
</template>

<script>

import getComments from "@/components/comments/Index.vue"

export default {
	data () {
		return {
			name: '',
			text: '',
		}
	}, 
	methods: {
		send () {
			this.$fb.collection("comments").add({
				name: this.name,
				text: this.text,
				createdAt: new window.firebase.firestore.Timestamp.now()
			})
			.then(res => {
				this.name = ''
				this.text = ''
				this.getCreated(res.path)
			})
		},
		getCreated (path) {
			this.$fb.doc(path).get().then((res) => {
				const newComment = {
					id: res.id,
					...res.data(),
					ref: res.ref.path
				}
				this.$emit("addNew", newComment)
			})
		}
	}
}
</script>

<style>

</style>