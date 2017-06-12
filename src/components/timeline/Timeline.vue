<template>
    <ul :class="classes">
        <slot></slot>
    </ul>
</template>
<script>
    const prefixCls = 'ivu-timeline';

    export default {
        name: 'Timeline',
        props: {
            pending: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-pending`]: this.pending
                    }
                ];
            }
        }
    };
</script>



<style lang="less">

@css-prefix     : ivu-;
@timeline-prefix-cls: ~"@{css-prefix}timeline";

@border-color-split:#e9eaec;
@timeline-color: @border-color-split;

@primary-color: #20a0ff;

@success-color: #13ce66;
@error-color: #ff4949;

@font-size-base         : 14px;
@font-size-small        : 12px;

.@{timeline-prefix-cls} {
    list-style: none;
    margin: 0;
    padding: 0;

    &-item {
        margin: 0 !important;
        padding: 0 0 12px 0;
        list-style: none;
        position: relative;

        &-tail {
            height: 100%;
            border-left: 1px solid @timeline-color;
            position: absolute;
            left: 6px;
            top: 0;
        }

        &-pending &-tail {
            display: none;
        }

        &-head {
            width: 13px;
            height: 13px;
            background-color: #fff;
            border-radius: 50%;
            border: 1px solid transparent;
            position: absolute;

            &-blue {
                border-color: @primary-color;
                color: @primary-color;
            }
            &-red {
                border-color: @error-color;
                color: @error-color;
            }
            &-green {
                border-color: @success-color;
                color: @success-color;
            }
        }

        &-head-custom {
            width: 40px;
            height: auto;
            margin-top: 6px;
            padding: 3px 0;
            text-align: center;
            line-height: 1;
            border: 0;
            border-radius: 0;
            font-size: @font-size-base;
            position: absolute;
            left: -13px;
            transform: translateY(-50%);
        }

        &-content {
            padding: 1px 1px 10px 24px;
            font-size: @font-size-small;
            position: relative;
            top: -3px;
        }

        &:last-child {
            .@{timeline-prefix-cls}-item-tail {
                display: none;
            }
        }
    }

    &&-pending &-item:nth-of-type(1) {

        .@{timeline-prefix-cls}-item-tail {
            border-left: 1px dotted @timeline-color;
        }
        .@{timeline-prefix-cls}-item-content {
            min-height: 48px;
        }
    }
}
    
</style>