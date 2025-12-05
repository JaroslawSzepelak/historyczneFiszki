<template>
    <div class="d-inline">
        <input type="radio" class="btn-check" v-model="value" :value="buttonAnswer" :id="answerId" autocomplete="off" :disabled="disabled"/>
        <label class="btn btn-lg mb-2" :class="buttonClass" :for="answerId">{{ buttonAnswer }}</label>
    </div>
</template>

<script>
    export default {
        props: {
            userAnswer: String,
            buttonAnswer: String,
            answerId: String,
            buttonClass: {
                type: String,
                default: 'btn-outline-primary'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        emits: ['update:userAnswer'],

        computed: {
            value: {
                get() {
                    return this.userAnswer
                },
                set(value) {
                    this.$emit('update:userAnswer', value)
                }
            }
        }
    }
</script>