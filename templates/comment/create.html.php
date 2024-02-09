<?php

/** @var \App\Model\Comment $comment */
/** @var \App\Service\Router $router */

$title = 'Create Comment';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Comment</h1>
    <form action="<?= $router->generateCommentPath('create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="comment-create">
    </form>

    <a href="<?= $router->generateCommentPath('index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
