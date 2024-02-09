<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "{$post->getSubject()} ({$post->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $post->getSubject() ?></h1>
    <article>
        <?= $post->getContent();?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('post-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('post-edit', ['id'=> $post->getId()]) ?>">Edit</a></li>
    </ul>

    <h2>Add Comment</h2>
    <form action="<?= $router->generateCommentPath('create') ?>" method="post">
        <input type="hidden" name="comment[postId]" value="<?= $post->getId() ?>">
        <div>
            <label for="comment-author">Your Name:</label>
            <input type="text" id="comment-author" name="comment[author]">
        </div>
        <div>
            <label for="comment-content">Comment:</label>
            <textarea id="comment-content" name="comment[content]"></textarea>
        </div>
        <button type="submit">Add Comment</button>
    </form>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
